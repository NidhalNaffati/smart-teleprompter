import "../styles/SpeechToTextAnalyzer.css";
import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";
import {isWordSimilar} from "../utils/word-similarity.ts";
import {goToNextParagraphIfTheCurrentOneIsCompleted, resetTextStateVariables} from "../utils/speech-analyzer-utils";

const ipcRenderer = (window as any).ipcRenderer as IpcRenderer;

function SpeechToTextAnalyzer() {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [lastRecognizedText, setLastRecognizedText] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>("");
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);

  const referenceText: string =
    "hello everyone today we are going to discuss how this application works and how we can improve it in the future\n" +
    "first of all this application is written in typescript react and electron\n" +
    "this application uses the speech recognition from vosk and renders the text using react";

  const referenceParagraphs: string[] = referenceText.split("\n");

  // Listen for messages from the main process and update the state when received
  useEffect(() => {
    const handleRecognizedText = (_event: any, text: string) => {
      let newText: string;

      if (text.startsWith(startingWord)) { // Continue reading without interruption
        // Set the recognized text based on the context
        newText = lastRecognizedText ? recognizedText.replace(lastRecognizedText, text) : text;
      } else { // There is an interruption
        // Set the recognized text to the last recognized text plus the new text
        newText = recognizedText + " " + text;
      }

      setRecognizedText(newText);
      setLastRecognizedText(text);

      // Go to the next paragraph if the current one is completed
      goToNextParagraphIfTheCurrentOneIsCompleted(text, currentParagraphIndex, referenceParagraphs, goToNextParagraph);
    };

    ipcRenderer.on("recognized-text", handleRecognizedText);

    // Remove the listener when the components unmount
    return () => {
      ipcRenderer.removeAllListeners("recognized-text");
    };
  }, [lastRecognizedText, recognizedText, startingWord]);

  // Update the starting word using the lastRecognizedText state
  useEffect(() => {
    setStartingWord(lastRecognizedText.split(" ")[0]);
  }, [lastRecognizedText]);

  function handleResetClick() {
    setCurrentParagraphIndex(0);
    resetTextStateVariables(setRecognizedText, setLastRecognizedText, setStartingWord);
  }

  function goToNextParagraph() {
    if (currentParagraphIndex < referenceParagraphs.length - 1) {
      setCurrentParagraphIndex(currentParagraphIndex + 1);
      resetTextStateVariables(setRecognizedText, setLastRecognizedText, setStartingWord)
    }
  }

  function goToPreviousParagraph() {
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex(currentParagraphIndex - 1);
      resetTextStateVariables(setRecognizedText, setLastRecognizedText, setStartingWord)
    }
  }

  function renderComparison() {
    const referenceParagraph = referenceParagraphs[currentParagraphIndex];
    const referenceWords = referenceParagraph.split(" ");
    const recognizedWords = recognizedText.split(" ");
    return referenceWords.map((referenceWord, i) => {
      const userWord = recognizedWords[i];
      const isWordSpelledCorrectly = isWordSimilar(userWord, referenceWord, 70);

      return (
        <span
          key={i}
          className={`comparison-word ${isWordSpelledCorrectly ? "matched" : "mismatched"}`}
        >
          {referenceWord}{" "}
        </span>
      );
    });
  }

  const isNextDisabled = currentParagraphIndex === referenceParagraphs.length - 1;
  const isPreviousDisabled = currentParagraphIndex === 0;

  return (
    <>
      <div>
        <h2>{renderComparison()}</h2>
        <button onClick={goToPreviousParagraph} disabled={isPreviousDisabled}>
          ⬅️
        </button>
        <button onClick={goToNextParagraph} disabled={isNextDisabled}>
          ➡️
        </button>
        <button onClick={handleResetClick}>Reset</button>
      </div>
    </>
  );
}

export default SpeechToTextAnalyzer;
