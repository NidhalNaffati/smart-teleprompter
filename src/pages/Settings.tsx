import {ChangeEvent, useEffect, useState} from "react";
import {IpcRenderer} from "electron";

const ipcRenderer: IpcRenderer = window.ipcRenderer;

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [model, setModel] = useState("");
  const [wordSimilarityPercentage, setWordSimilarityPercentage] = useState(0);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  useEffect(() => {
    // List all the available models
    ipcRenderer.invoke("list-available-models")
      .then((result) => {
        setAvailableModels(result);
      })
      .catch((error) => {
        console.error('Error listing models:', error);
      });
  }, []);

  useEffect(() => {
    // Get the settings from the main process
    ipcRenderer.invoke("get-settings").then((result) => {
      setSettings(result);
      setModel(result.model);
      setWordSimilarityPercentage(result.wordSimilarityPercentage);
    }).catch((error) => {
      console.error('Error getting settings:', error);
    });

    // Clean up on unmount
    return () => {
      ipcRenderer.removeAllListeners("get-settings");
    };
  }, []);

  const handleModelChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setModel(event.target.value);
  };

  const handleWordSimilarityPercentageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWordSimilarityPercentage(parseInt(event.target.value));
  };

  const handleSaveSettings = () => {
    ipcRenderer.invoke("save-settings", {model, wordSimilarityPercentage}).then(() => {
      console.log("Settings saved");
    }).catch((error) => {
      console.error("Error saving settings:", error);
    });
  };

  return (
    <div>
      <h1>Settings</h1>
      {settings && (
        <div>
          <label>Model:</label>
          <select value={model} onChange={handleModelChange}>
            {availableModels.map((availableModel) => (
              <option key={availableModel} value={availableModel}>{availableModel}</option>
            ))}
          </select>
          <br/>
          <label>Word Similarity Percentage:</label>
          <input
            type="number"
            value={wordSimilarityPercentage}
            onChange={handleWordSimilarityPercentageChange}
          />
          <br/>
          <button onClick={handleSaveSettings}>Save Settings</button>
        </div>
      )}
    </div>
  );
}
