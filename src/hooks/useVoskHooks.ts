import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";

// Custom hook to handle the logic for vosk api speech recognition
const useTextAnalyzerHooks = () => {
  // State variables
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [lastRecognizedText, setLastRecognizedText] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>("");

  // Handles recognized text from IPC renderer and updates state accordingly.
  const handleRecognizedText = (
    _event: Electron.IpcRendererEvent,
    text: string,
  ) => {

    let newText: string;

    if (text.startsWith(startingWord)) { // Continue reading without interruption
      // Set the recognized text to the last recognized text plus the new text
      newText = recognizedText.replace(lastRecognizedText, "") + text;
    } else { // There is an interruption
      // Set the recognized text to the last recognized text plus the new text
      newText = recognizedText + " " + text.replace(lastRecognizedText, "");
    }

    setRecognizedText(newText);
    setLastRecognizedText(text);
  };

  useEffect(() => {
    const ipcRenderer: IpcRenderer = window.ipcRenderer;

    // Listen for recognized text events from IPC renderer
    ipcRenderer.on("recognized-text", handleRecognizedText);

    // Cleanup function to remove event listener
    return () => {
      ipcRenderer.removeAllListeners("recognized-text");
    };
  }, [lastRecognizedText, recognizedText, startingWord]);

  useEffect(() => {
    // Update the starting word based on the last recognized text
    setStartingWord(lastRecognizedText.split(" ")[0]);
  }, [lastRecognizedText]);


  // Return the state variables and functions for external usage
  return {
    recognizedText,
  };
};

export default useTextAnalyzerHooks;
