import {app, BrowserWindow} from "electron";
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

  // Define interfaces for the message structure
  interface PartialResultMessage {
    partialResult: {
      partial: string;
    };
  }

  // Listen for messages from the child process
  serverProcess.on("message", (message: PartialResultMessage) => {
    if (message.partialResult) {
      const partialResult = message.partialResult.partial; // Extract the 'partial' value as a string
      // Send the partial result to the renderer process
      win?.webContents.send("recognized-text", partialResult);
      console.log(">> ", partialResult);
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
