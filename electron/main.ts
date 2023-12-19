import {app, BrowserWindow, ipcMain} from "electron";
import path from "node:path";
import childProcess from "child_process";
import {startVoskProcess, stopVoskProcess} from "../src/utils/vosk-process.ts";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null = null;
let voskProcess: childProcess.ChildProcess | null = null;

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 900,
    alwaysOnTop: true, // true at the moment for testing
    title: "smart-teleprompter",
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }

  ipcMain.on("start-recognition", () => {
    voskProcess = startVoskProcess(win!)
  });

  ipcMain.on("stop-recognition", () => {
    stopVoskProcess(voskProcess!, win!)
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;

    // Kill the server process when the Electron app is closed
    if (voskProcess) {
      console.log("Killing vosk process...");
      voskProcess.kill();
      voskProcess = null;
    }
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
