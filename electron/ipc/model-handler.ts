import {ipcMain} from "electron";
import {deleteModel, downloadModel, listAvailableModels} from "../utils/model-files-handler.ts";

export function registerModelDownloadIPC() {
  ipcMain.on('download-model', (_event, url, name) => {
    downloadModel(url, name);
  });

  ipcMain.on('delete-model', (_event, name) => {
    deleteModel(name);
  });

  ipcMain.handle('list-available-models', () => {
    return listAvailableModels();
  });
}
