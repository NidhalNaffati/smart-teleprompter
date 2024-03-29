import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";
import {
  goToNextParagraphIfTheCurrentOneIsCompleted,
  resetTextStateVariables,
} from "../utils/speech-analyzer-utils";

// Custom hook to handle the logic for the text analyzer
const useTextAnalyzerHooks = (referenceParagraphs: string[]) => {
  // State variables
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [lastRecognizedText, setLastRecognizedText] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>("");
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);

  // Handles recognized text from IPC renderer and updates state accordingly.
  const handleRecognizedText = (
    _event: Electron.IpcRendererEvent,
    text: string,
  ) => {
    let newText: string;

    // Check if the recognized text starts with the same word as the previous one
    if (text.startsWith(startingWord)) {
      // If yes, replace the last recognized text with the new one
      newText = lastRecognizedText
        ? recognizedText.replace(lastRecognizedText, text)
        : text;
    } else {
      // If not, append the new text to the existing recognized text
      newText = recognizedText + " " + text;
    }

    // Update recognized text and last recognized text states
    setRecognizedText(newText);
    setLastRecognizedText(text);

    // Check if the current paragraph is completed and move to the next one
    goToNextParagraphIfTheCurrentOneIsCompleted(
      text,
      currentParagraphIndex,
      referenceParagraphs,
      goToNextParagraph,
    );
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

  const goToNextParagraph = () => {
    // Check if all paragraphs have been read
    if (currentParagraphIndex === referenceParagraphs.length - 1) {
      console.log("All paragraphs have been read.");
      alert("All paragraphs have been read.");
    }

    // Move to the next paragraph if available
    if (currentParagraphIndex < referenceParagraphs.length - 1) {
      setCurrentParagraphIndex(currentParagraphIndex + 1);
      resetTextStateVariables(setRecognizedText, setLastRecognizedText, setStartingWord);
    }
  };

  const goToPreviousParagraph = () => {
    // Move to the previous paragraph if available
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex(currentParagraphIndex - 1);
      resetTextStateVariables(setRecognizedText, setLastRecognizedText, setStartingWord);
    }
  };

  // Reset the text state variables
  const handleResetClick = () => {
    setCurrentParagraphIndex(0);
    resetTextStateVariables(setRecognizedText, setLastRecognizedText, setStartingWord);
  };

  // Return the state variables and functions for external usage
  return {
    recognizedText,
    currentParagraphIndex,
    handleResetClick,
    goToNextParagraph,
    goToPreviousParagraph,
  };
};

export default useTextAnalyzerHooks;
