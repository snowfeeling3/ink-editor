#[cfg(debug_assertions)]
use tauri::Manager;

mod commands;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|_app| {
            #[cfg(debug_assertions)]
            {
                _app.get_webview_window("main").unwrap().open_devtools();
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::read_file,
            commands::write_file,
            commands::list_directory,
            commands::file_exists,
            commands::close_window,
            commands::minimize_window,
            commands::toggle_maximize,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
