import {ipcMain, BrowserWindow} from "electron";
import childProcess from "child_process";
import {startVoskProcess, stopVoskProcess} from "../utils/vosk-process/vosk-process.ts";

const IPC_CHANNELS = {
  START_RECOGNITION: "start-recognition",
  STOP_RECOGNITION: "stop-recognition",
};

let voskProcess: childProcess.ChildProcess;

export function registerVoskIPC(win: BrowserWindow) {
  ipcMain.on(IPC_CHANNELS.START_RECOGNITION, () => {
    voskProcess = startVoskProcess(win);
  });

  ipcMain.on(IPC_CHANNELS.STOP_RECOGNITION, () => {
    stopVoskProcess(voskProcess, win);
  });
}
