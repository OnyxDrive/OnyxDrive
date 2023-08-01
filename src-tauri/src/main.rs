// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_lib;
mod files;
mod storage;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![files::read_directory])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
