import {app, ipcMain} from "electron";
import path from "node:path";
import * as fs from "fs";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

const userDataPath = app.getPath('userData');
const settingsFilePath = path.join(userDataPath, 'settings.json');

interface Settings {
  model: string;
  wordSimilarityPercentage: number;
}

const defaultSettings: Settings = {
  model: "vosk-model-en-us-0.22",
  wordSimilarityPercentage: 80,
};

// Define IPC channel names
const IPC_CHANNELS = {
  GET_SETTINGS: 'get-settings',
  GET_DEFAULT_SETTINGS: 'get-default-settings',
  GET_PARAMETER: 'get-parameter',
  SAVE_SETTINGS: 'save-settings',
  UPDATE_PARAMETER: 'update-parameter'
};


export function initializeSettingsIPC() {

  // Handler for GET_SETTINGS IPC channel
  ipcMain.handle(IPC_CHANNELS.GET_SETTINGS, () => {
    return loadSettings();
  });

  // Handler for GET_DEFAULT_SETTINGS IPC channel
  ipcMain.handle(IPC_CHANNELS.GET_DEFAULT_SETTINGS, () => {
    return getDefaultSettings();
  });

  // Handler for GET_PARAMETER IPC channel
  ipcMain.handle(IPC_CHANNELS.GET_PARAMETER, (_even: IpcMainInvokeEvent, parameter) => {
    return getParameter(parameter);
  });

  // Handler for UPDATE_PARAMETER IPC channel
  ipcMain.handle(IPC_CHANNELS.UPDATE_PARAMETER, (_even: IpcMainInvokeEvent, parameter, value) => {
    updateParameter(parameter, value);
  });

  // Handler for SAVE_SETTINGS IPC channel
  ipcMain.handle(IPC_CHANNELS.SAVE_SETTINGS, (_even: IpcMainInvokeEvent, settings) => {
    saveSettings(settings);
  });

}

function loadSettings() {
  try {
    // If the settings file it doesn't exist, create it with default settings
    if (!fs.existsSync(settingsFilePath)) {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 4), "utf8");
      console.log("Settings file created with default values.");
      return defaultSettings;
    }

    // Read the file synchronously
    const settingsData = fs.readFileSync(settingsFilePath, "utf8");
    // Parse JSON data
    return JSON.parse(settingsData);

  } catch (error) {
    console.error("Error reading settings:", error);
    return getDefaultSettings();
  }
}

function getParameter(parameter: string) {
  const settings = loadSettings();
  // read the parameter from the settings
  return settings[parameter];
}

function saveSettings(settings: Settings) {
  try {
    console.log("Saving settings ... ", settings);
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error("Error saving settings:", error);
  }
}

function updateParameter(parameter: string, value: string) {
  const settings = loadSettings();
  settings[parameter] = value;
  saveSettings(settings);
}

function getDefaultSettings() {
  // write the default settings to the file
  saveSettings(defaultSettings);
  return defaultSettings;
}
