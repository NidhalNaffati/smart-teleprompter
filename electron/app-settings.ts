import {app} from "electron";
import fs from "fs";

interface settings {
  model: string;
}

const defaultSettings: settings = {
  model: "vosk-model-en-us-0.22"
};

const settingsFilePath = `${app.getPath('userData')}/settings/settings.json`;


export function getSettings() {
  try { // read the settings file
    const data = fs.readFileSync(settingsFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) { // if there is an error, return the default settings
    console.log("Error reading settings file: ", error)
    return defaultSettings;
  }
}

export function setSettings(settings: settings) {
  // write the settings to the file
  fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
}

export function writeAppSettings() {
  if (!fs.existsSync(settingsFilePath)) {
    // if it doesn't exist, create it with default settings
    fs.mkdirSync(`${app.getPath('userData')}/settings`, {recursive: true});
    fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
  }
}
