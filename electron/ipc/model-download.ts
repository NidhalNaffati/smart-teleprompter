import {ipcMain} from "electron";
import {downloadFile} from "../utils/model-download.ts";

export function registerModelDownloadIPC() {
  ipcMain.on('download-file', (_event, url) => {
    downloadFile(url);
  });
}
