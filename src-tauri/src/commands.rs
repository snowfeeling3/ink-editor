use std::fs;
use std::path::Path;

#[tauri::command]
pub fn read_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path).map_err(|e| format!("Failed to read file: {}", e))
}

#[tauri::command]
pub fn write_file(path: String, content: String) -> Result<(), String> {
    if let Some(parent) = Path::new(&path).parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
        }
    }
    fs::write(&path, &content).map_err(|e| format!("Failed to write file: {}", e))
}

#[derive(serde::Serialize)]
pub struct DirEntry {
    name: String,
    path: String,
    is_dir: bool,
    children: Option<Vec<DirEntry>>,
}

#[tauri::command]
pub fn list_directory(path: String) -> Result<Vec<DirEntry>, String> {
    let dir = Path::new(&path);
    if !dir.is_dir() {
        return Err(format!("Not a directory: {}", path));
    }

    let mut entries: Vec<DirEntry> = Vec::new();
    let read_dir = fs::read_dir(dir).map_err(|e| format!("Failed to read directory: {}", e))?;

    for entry in read_dir {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let file_type = entry.file_type().map_err(|e| format!("Failed to get file type: {}", e))?;
        let name = entry.file_name().to_string_lossy().to_string();

        // Skip hidden files and node_modules
        if name.starts_with('.') || name == "node_modules" || name == "target" {
            continue;
        }

        let entry_path = entry.path().to_string_lossy().to_string();

        if file_type.is_dir() {
            let children = list_directory(entry_path.clone()).ok();
            entries.push(DirEntry {
                name,
                path: entry_path,
                is_dir: true,
                children,
            });
        } else {
            // Only include supported file types
            let lower = name.to_lowercase();
            if lower.ends_with(".md")
                || lower.ends_with(".txt")
                || lower.ends_with(".markdown")
                || lower.ends_with(".mdown")
                || lower.ends_with(".mkd")
            {
                entries.push(DirEntry {
                    name,
                    path: entry_path,
                    is_dir: false,
                    children: None,
                });
            }
        }
    }

    // Sort: directories first, then files, alphabetically
    entries.sort_by(|a, b| {
        if a.is_dir != b.is_dir {
            b.is_dir.cmp(&a.is_dir) // directories first
        } else {
            a.name.to_lowercase().cmp(&b.name.to_lowercase())
        }
    });

    Ok(entries)
}

#[tauri::command]
pub fn file_exists(path: String) -> Result<bool, String> {
    Ok(Path::new(&path).exists())
}

#[tauri::command]
pub fn create_file(path: String) -> Result<(), String> {
    if let Some(parent) = Path::new(&path).parent() {
        if !parent.exists() {
            fs::create_dir_all(parent).map_err(|e| format!("Failed to create directory: {}", e))?;
        }
    }
    fs::write(&path, "").map_err(|e| format!("Failed to create file: {}", e))
}

#[tauri::command]
pub fn create_directory(path: String) -> Result<(), String> {
    fs::create_dir_all(&path).map_err(|e| format!("Failed to create directory: {}", e))
}

// Window control commands — called from frontend via invoke()

#[tauri::command]
pub fn close_window(window: tauri::WebviewWindow) -> Result<(), String> {
    window.destroy().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn minimize_window(window: tauri::WebviewWindow) -> Result<(), String> {
    window.minimize().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn toggle_maximize(window: tauri::WebviewWindow) -> Result<(), String> {
    if window.is_maximized().unwrap_or(false) {
        window.unmaximize().map_err(|e| e.to_string())
    } else {
        window.maximize().map_err(|e| e.to_string())
    }
}
