import {app, BrowserWindow} from "electron";
import path from "node:path";
import {registerVoskIPC} from "./ipc/vosk.ts";
import {registerModelDownloadIPC} from "./ipc/model-handler.ts";
import {writeAppSettings} from "./app-settings.ts";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let window: BrowserWindow;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

export function createWindow(): BrowserWindow {
  window = new BrowserWindow({
    width: 900,
    height: 900,
    alwaysOnTop: true,
    title: "smart-teleprompter",
    autoHideMenuBar: true,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  window.webContents.on("did-finish-load", () => {
    window?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    window.loadURL(VITE_DEV_SERVER_URL);
  } else {
    window.loadFile(path.join(process.env.DIST, "index.html"));
  }

  // set the default settings if they don't exist
  writeAppSettings();

  // initialize IPC handlers for Vosk
  registerVoskIPC(window);

  // initialize IPC handlers for model download
  registerModelDownloadIPC();

  return window;
}