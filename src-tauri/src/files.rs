use parselnk::Lnk;
use std::{fs, path::Path, time::SystemTime};

use crate::{file_lib, storage};

#[derive(serde::Serialize, Clone, Debug)]
pub struct LnkData {
	file_path: String,
	icon: String,
}

#[derive(serde::Serialize, Clone, Debug)]
pub struct FileMetaData {
	file_path: String,
	basename: String,
	file_type: String,
	is_dir: bool,
	is_hidden: bool,
	is_file: bool,
	is_system: bool,
	size: u64,
	readonly: bool,
	last_modified: SystemTime,
	last_accessed: SystemTime,
	created: SystemTime,
	is_trash: bool,
}

#[derive(serde::Serialize)]
pub struct TrashMetaData {
	file_path: String,
	basename: String,
	file_type: String,
	original_parent: String,
	time_deleted: i64,
	is_trash: bool,
	is_dir: bool,
	is_hidden: bool,
	is_file: bool,
	is_system: bool,
	size: u64,
	readonly: bool,
	last_modified: SystemTime,
	last_accessed: SystemTime,
	created: SystemTime,
}

#[derive(serde::Serialize)]
pub struct FolderInformation {
	number_of_files: u16,
	files: Vec<FileMetaData>,
	skipped_files: Vec<String>,
	lnk_files: Vec<LnkData>,
}

pub struct FileSystemUtils;

impl FileSystemUtils {
	/// Get basename of the path given
	#[inline]
	pub fn get_basename(file_path: &str) -> String {
		match Path::new(&file_path).file_name() {
			Some(basename) => basename.to_str().unwrap().to_string(),
			None => file_path.to_string(),
		}
	}

	/// Check if a file/dir is a symlink
	#[cfg(windows)]
	#[inline]
	pub fn check_is_symlink(file_path: &str) -> bool {
		let symlink_metadata = match fs::symlink_metadata(file_path) {
			Ok(result) => result,
			Err(_) => return true,
		};

		symlink_metadata.file_attributes() == 1040
	}

	/// Check if a file/dir is a symlink
	#[cfg(unix)]
	#[inline]
	pub fn check_is_symlink(_: &str) -> bool {
		false
	}

	/// Check if a file is hidden
	///
	/// Checking file_attributes metadata of a file and check if it is hidden
	#[cfg(windows)]
	#[inline]
	pub fn check_is_hidden(file_path: &str) -> bool {
		let attributes = fs::metadata(file_path).unwrap().file_attributes();

		(attributes & 0x2) > 0
	}

	/// Check if a file is hidden
	///
	/// Checking a file is hidden by checking if the file name starts with a dot
	#[cfg(unix)]
	#[inline]
	pub fn check_is_hidden(file_path: &str) -> bool {
		let basename = Self::get_basename(file_path);

		basename.starts_with(".")
	}

	/// Check if a file is system file
	///
	/// Checking file_attributes metadata of a file and check if it is system file
	#[cfg(windows)]
	#[inline]
	fn check_is_system_file(file_path: &str) -> bool {
		let attributes = fs::metadata(file_path).unwrap().file_attributes();

		(attributes & 0x4) > 0
	}

	#[cfg(unix)]
	#[inline]
	fn check_is_system_file(_: &str) -> bool {
		false
	}
}

#[cfg(not(target_os = "windows"))]
#[tauri::command]
#[inline]
pub async fn extract_icon(_: &str) -> Result<String, String> {
	Err("Not supported".to_string())
}

#[tauri::command]
#[inline]
pub async fn get_dir_size(dir: String) -> u64 {
	let mut total_size = 0;
	let mut stack = vec![dir];

	while let Some(path) = stack.pop() {
		let entry = match fs::read_dir(path) {
			Ok(result) => result,
			Err(_) => continue,
		};

		for file in entry {
			let file = file.unwrap();
			let metadata = file.metadata().unwrap();
			if metadata.is_dir() {
				stack.push(file.path().to_string_lossy().to_string());
			} else {
				total_size += metadata.len();
			}
		}
	}

	total_size
}

#[tauri::command]
pub async fn calculate_files_total_size(files: Vec<String>) -> u64 {
	let mut total_size: u64 = 0;

	for file in files {
		let metadata = fs::metadata(&file).unwrap();
		if metadata.is_dir() {
			total_size += get_dir_size(file.clone()).await;
		}

		total_size += metadata.len();
	}

	total_size
}

#[tauri::command]
pub async fn get_file_properties(file_path: &str) -> Result<FileMetaData, String> {
	let metadata = match fs::metadata(file_path) {
		Ok(result) => result,
		Err(e) => return Err(e.to_string()),
	};

	let last_modified = match metadata.modified() {
		Ok(result) => result,
		Err(e) => return Err(e.to_string()),
	};

	let last_accessed = match metadata.accessed() {
		Ok(result) => result,
		Err(e) => return Err(e.to_string()),
	};

	let created = match metadata.created() {
		Ok(result) => result,
		Err(e) => return Err(e.to_string()),
	};

	let is_symlink = FileSystemUtils::check_is_symlink(file_path);
	let is_hidden = if is_symlink {
		false
	} else {
		FileSystemUtils::check_is_hidden(file_path)
	};
	let is_system = if is_symlink {
		false
	} else {
		FileSystemUtils::check_is_system_file(file_path)
	};

	let is_dir = metadata.is_dir();
	let basename = FileSystemUtils::get_basename(file_path);
	let file_type = if is_symlink {
		"System link".to_string()
	} else {
		file_lib::get_type(&basename, is_dir).await
	};

	let size = if is_dir {
		let preference = match storage::read_data("preference") {
			Ok(result) => result,
			Err(_) => return Err("Error reading preference".into()),
		};
		let preference = if preference.status || preference.data == serde_json::Value::Null {
			preference.data
		} else {
			return Err("Error reading preference".into());
		};
		let calculate_sub_folder_size = match preference {
			serde_json::Value::Null => false,
			_ => preference["calculateSubFolderSize"]
				.as_bool()
				.unwrap_or(false),
		};
		if calculate_sub_folder_size {
			calculate_files_total_size(vec![file_path.to_string()]).await
		} else {
			0
		}
	} else {
		metadata.len()
	};
	Ok(FileMetaData {
		is_system,
		is_hidden,
		is_dir: is_dir,
		is_file: metadata.is_file(),
		size,
		readonly: metadata.permissions().readonly(),
		last_modified,
		last_accessed,
		created,
		file_path: file_path.to_string(),
		file_type,
		basename,
		is_trash: false,
	})
}

#[tauri::command]
pub async fn read_directory(dir: &Path) -> Result<FolderInformation, String> {
	let preference = match storage::read_data("preference") {
		Ok(result) => result,
		Err(_) => return Err("Error reading preference".into()),
	};
	let preference = if preference.status || preference.data == serde_json::Value::Null {
		preference.data
	} else {
		return Err("Error reading preference".into());
	};
	let hide_system_files = match preference {
		serde_json::Value::Null => true,
		_ => preference["hideSystemFiles"].as_bool().unwrap_or(true),
	};
	let paths = match fs::read_dir(dir) {
		Ok(result) => result,
		Err(e) => return Err(e.to_string().into()),
	};
	let mut number_of_files = 0;
	let mut files = Vec::new();
	let mut skipped_files = Vec::new();
	let mut lnk_files = Vec::new();

	for path in paths {
		number_of_files += 1;
		let file_path = path.unwrap().path().display().to_string();
		let file_info = get_file_properties(&file_path).await;
		match file_info {
			Ok(file_info) => {
				if hide_system_files && file_info.is_system {
					skipped_files.push(file_path.to_string());
					continue;
				}

				if file_info.file_type == "Windows Shortcut" {
					let path = std::path::Path::new(&file_info.file_path);
					let icon = match Lnk::try_from(path).unwrap().string_data.icon_location {
						Some(icon) => {
							let icon = icon.as_path().to_string_lossy().to_string();
							let icon_type = file_lib::get_type(&icon, false).await;
							match icon_type.as_str() {
								"Image" => icon,
								"Executable" => extract_icon(&icon).await.unwrap_or_default(),
								_ => Default::default(),
							}
						}
						None => Default::default(),
					};

					lnk_files.push(LnkData { file_path, icon });
					files.push(file_info)
				} else {
					files.push(file_info)
				}
			}
			Err(_) => {
				skipped_files.push(file_path);

				continue;
			}
		}
	}

	Ok(FolderInformation {
		number_of_files,
		files,
		skipped_files,
		lnk_files,
	})
}
