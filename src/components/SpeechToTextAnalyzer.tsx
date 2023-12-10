import "../App.css";
import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";
import {isWordSimilar} from "../utils/wordSimilarity";

const ipcRenderer = (window as any).ipcRenderer as IpcRenderer;

function SpeechToTextAnalyzer() {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [recognizedWords, setRecognizedWords] = useState<string[]>([]);
  const [lastRecognizedText, setLastRecognizedText] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>("");

  const referenceText: string = "hello everyone today we are going to discuss how this application works and how we can improve it in the future";
  const referenceWords: string[] = referenceText.split(" ");

  // Listen for messages from the main process and update the state when received
  useEffect(() => {
    const handleRecognizedText = (_event: any, text: string) => {
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

    ipcRenderer.on("recognized-text", handleRecognizedText);

    // Remove the listener when the components unmounts
    return () => {
      ipcRenderer.removeAllListeners("recognized-text");
    };
  }, [lastRecognizedText, recognizedText, startingWord]);

  // Update the recognized words using the recognizedText state
  useEffect(() => {
    setRecognizedWords(recognizedText.split(" "));
  }, [recognizedText]);

  // Update the starting word using the lastRecognizedText state
  useEffect(() => {
    setStartingWord(lastRecognizedText.split(" ")[0]);
  }, [lastRecognizedText]);


  function renderComparison() {
    return referenceWords.map(
      (referenceWord, i) => {
        const userWord = recognizedWords[i];

        // Determine if the word matches the reference word with a 70% or more similarity
        const isWordSpelledCorrectly: boolean = isWordSimilar(
          userWord,
          referenceWord,
          70
        );

        // Set the color and font weight based on the match status
        const color = isWordSpelledCorrectly ? "#00ff00" : "#ff0000";
        const fontWeight = isWordSpelledCorrectly ? "bold" : "normal";

        return (
          <span key={i} style={{color, fontWeight, cursor: "pointer"}}>
            {referenceWord}{" "}
          </span>
        );
      });
  }

  return (
    <>
      <div>
        <h2>{renderComparison()}</h2>
      </div>
    </>
  );
}

export default SpeechToTextAnalyzer;
