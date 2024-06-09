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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold mb-4">Settings</h1>
      {settings && (
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label htmlFor="model" className="text-lg font-medium mb-1">Model:</label>
            <select id="model" value={model} onChange={handleModelChange}
                    className="border border-gray-300 rounded-lg p-2">
              {availableModels.map((availableModel) => (
                <option key={availableModel} value={availableModel}>{availableModel}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="wordSimilarityPercentage" className="text-lg font-medium mb-1">Word Similarity
              Percentage:</label>
            <input
              id="wordSimilarityPercentage"
              type="number"
              value={wordSimilarityPercentage}
              onChange={handleWordSimilarityPercentageChange}
              className="border border-gray-300 rounded-lg p-2"
            />
          </div>
          <button onClick={handleSaveSettings}
                  className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out">Save
            Settings
          </button>
        </div>
      )}
    </div>
  );
}
