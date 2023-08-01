export type SystemTime = {
	nanos_since_epoch: number
	secs_since_epoch: number
}

export type FileMetaData = {
	file_path: string
	basename: string
	file_type: string
	original_parent?: string
	time_deleted?: number
	is_trash: boolean
	is_dir?: boolean
	is_hidden?: boolean
	is_file?: boolean
	is_system?: boolean
	size?: number
	readonly?: boolean
	last_modified?: SystemTime
	last_accessed?: SystemTime
	created?: SystemTime
}

export type LnkData = {
	file_path: string
	icon: string
}

export type DirectoryData = {
	files: FileMetaData[]
	number_of_files: number
	skipped_files: string[]
	lnk_files: LnkData[]
}
