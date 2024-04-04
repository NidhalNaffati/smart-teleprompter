import { ipcMain, BrowserWindow } from "electron";
import childProcess from "child_process";
import { startVoskProcess, stopVoskProcess } from "../utils/vosk-process/vosk-process.ts";

let voskProcess: childProcess.ChildProcess;

export function registerVoskIPC(win: BrowserWindow) {
	ipcMain.on("start-recognition", () => {
		voskProcess = startVoskProcess(win);
	});

	ipcMain.on("stop-recognition", () => {
		stopVoskProcess(voskProcess, win);
	});
}
