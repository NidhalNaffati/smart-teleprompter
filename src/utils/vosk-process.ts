import childProcess from "child_process";
import {BrowserWindow} from "electron";
import path from "node:path";

function startVoskProcess(win: BrowserWindow) {
  console.log("Starting Vosk process...");

  // Spawn the Vosk process with Node inspector enabled
  const voskProcess = childProcess.spawn(
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
  voskProcess.on("message", (message: PartialResultMessage) => {
    if (message.partialResult) {
      const partialResult = message.partialResult.partial; // Extract the 'partial' value as a string
      // Send the partial result to the renderer process
      win?.webContents.send("recognized-text", partialResult);
      console.log(`>> ${partialResult}`);
    }
  });

  // Handle server process errors
  voskProcess.on("error", (err) => {
    console.error("Server process error:", err);
  });

  // Handle server process exit
  voskProcess.on("exit", (code, signal) => {
    console.log(`Server process exited with code ${code} and signal ${signal}`);
  });

  return voskProcess;
}

// Stop the Vosk process
function stopVoskProcess(voskProcess: childProcess.ChildProcess) {
  if (voskProcess) {
    console.log("Killing Vosk process...");
    voskProcess.kill();
  }
}

export {startVoskProcess, stopVoskProcess};
