import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import childProcess from "child_process";

process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
let serverProcess: childProcess.ChildProcess | null = null;

const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
  win = new BrowserWindow({
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

  serverProcess = childProcess.spawn(
    "node",
    ["--inspect", path.join(__dirname, "../transcription.js")],
    {
      stdio: ["pipe", "pipe", "pipe", "ipc"], // Establish IPC channel
    }
  );

  // Listen for messages from the child process
  serverProcess.on("message", (message) => {
    if (message.recognizedText) {
      // Handle recognized text from the child process
      console.log("Recognized Text:", message.recognizedText);
    } else if (message.partialResult) {
      // Handle partial result from the child process
      console.log("Partial Result:", message.partialResult);
    }
  });

  // Handle server process errors
  serverProcess.on("error", (err) => {
    console.error("Server process error:", err);
  });

  // Handle server process exit
  serverProcess.on("exit", (code, signal) => {
    console.log(`Server process exited with code ${code} and signal ${signal}`);
  });

  // Handle server process output
  //serverProcess.stdout?.on("data", (data) => {
  //  console.log(data);
  //});

  ipcMain.on("message", (event, message) => {
    console.log("Received message from renderer process:", message);
  });

  // Add this code in your main.ts file
  ipcMain.on("transcription-data", (event, data) => {
    // Handle the transcription data received from the child process
    console.log("Received transcription data:", data);

    // You can send this data to your renderer process if needed
    if (win) {
      win.webContents.send("transcription-data", data);
    }
  });

  ipcMain.on("transcription-partial", (event, partialData) => {
    // Handle the partial transcription data received from the child process
    console.log("Received partial transcription data:", partialData);

    // You can send this data to your renderer process if needed
    if (win) {
      win.webContents.send("transcription-partial", partialData);
    }
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;

    // Kill the server process when the Electron app is closed
    if (serverProcess) {
      console.log("Killing server process...");
      serverProcess.kill();
      serverProcess = null;
    }
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
