#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod metrics;
mod models;

use byte_unit::ByteUnit;
use metrics::MetricsState;
use sysinfo::{System, SystemExt};
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayMenu, SystemTrayMenuItem};

fn main() {
    let target_unit = ByteUnit::GB;
    let mut sys = System::new_all();

    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let hide = CustomMenuItem::new("hide".to_string(), "Hide");
    let tray_menu = SystemTrayMenu::new()
        .add_item(quit)
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(hide);
    let tray = SystemTray::new().with_menu(tray_menu);

    sys.refresh_all();

    tauri::Builder::default()
        // .on_window_event(|event| match event.event() {
        //     tauri::WindowEvent::CloseRequested { api, .. } => {
        //         api.prevent_close();
        //     }
        //     _ => (),
        // })
        .system_tray(tray)
        .on_system_tray_event(|app, event| match event {
            tauri::SystemTrayEvent::MenuItemClick { id, .. } => {
                let item_handle = app.tray_handle().get_item(&id);
                let window = app.get_window("main").unwrap();

                match id.as_str() {
                    "quit" => {
                        window.close().unwrap();
                    }
                    "hide" => {
                        window.hide().unwrap();
                        item_handle.set_title("Show").unwrap();
                    }
                    _ => {}
                }
            }
            _ => {}
        })
        .manage(MetricsState::new(sys, target_unit))
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            metrics::get_sysinfo,
            metrics::get_memory,
            metrics::get_swap
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
