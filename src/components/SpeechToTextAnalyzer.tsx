import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";
import {
  goToNextParagraphIfTheCurrentOneIsCompleted,
  resetTextStateVariables,
} from "../utils/speech-analyzer-utils";
import ScriptComparison from "./ScriptComparison.tsx";
import Navigation from "./Navigation.tsx";

const ipcRenderer: IpcRenderer = (window).ipcRenderer;

function SpeechToTextAnalyzer() {
  const [recognizedText, setRecognizedText] = useState<string>("");
  const [lastRecognizedText, setLastRecognizedText] = useState<string>("");
  const [startingWord, setStartingWord] = useState<string>("");
  const [currentParagraphIndex, setCurrentParagraphIndex] = useState<number>(0);

  const referenceText: string =
    "hello everybody today i'm excited to introduce the beta version of my application as you can see it works as a smart teleprompter\n" +
    "upon reading the script the application converts my speech into text and then compares it to the written text\n" +
    "the application also features automatic navigation this means that when i finish reading a paragraph it automatically moves to the next one\n" +
    "i designed this application for content creators eliminating the need to memorize scripts and providing an affordable alternative to traditional teleprompters\n" +
    "moreover it's beneficial for students like me who are trying to enhance their pronunciation you can find the list of supported languages in the link i'll provide\n" +
    "if you want to test this application you can follow the instructions in the read me file\n" +
    "finally i would like to thank you for watching this video";

  const referenceParagraphs: string[] = referenceText.split("\n");

  // Listen for messages from the main process and update the state when received
  useEffect(() => {
    const handleRecognizedText = (_event: Electron.IpcRendererEvent, text: string) => {
      let newText: string;

      if (text.startsWith(startingWord)) {
        // Continue reading without interruption
        // Set the recognized text based on the context
        newText = lastRecognizedText
          ? recognizedText.replace(lastRecognizedText, text)
          : text;
      } else {
        // There is an interruption
        // Set the recognized text to the last recognized text plus the new text
        newText = recognizedText + " " + text;
      }

      setRecognizedText(newText);
      setLastRecognizedText(text);

      // Go to the next paragraph if the current one is completed
      goToNextParagraphIfTheCurrentOneIsCompleted(
        text,
        currentParagraphIndex,
        referenceParagraphs,
        goToNextParagraph
      );
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
    resetTextStateVariables(
      setRecognizedText,
      setLastRecognizedText,
      setStartingWord
    );
  }

  function goToNextParagraph() {
    if (currentParagraphIndex < referenceParagraphs.length - 1) {
      setCurrentParagraphIndex(currentParagraphIndex + 1);
      resetTextStateVariables(
        setRecognizedText,
        setLastRecognizedText,
        setStartingWord
      );
    }
  }

  function goToPreviousParagraph() {
    if (currentParagraphIndex > 0) {
      setCurrentParagraphIndex(currentParagraphIndex - 1);
      resetTextStateVariables(
        setRecognizedText,
        setLastRecognizedText,
        setStartingWord
      );
    }
  }

  const isNextDisabled =
    currentParagraphIndex === referenceParagraphs.length - 1;
  const isPreviousDisabled = currentParagraphIndex === 0;

  return (
    <>
      <div>
        <Navigation
          goToPreviousParagraph={goToPreviousParagraph}
          goToNextParagraph={goToNextParagraph}
          reset={handleResetClick}
          isPreviousDisabled={isPreviousDisabled}
          isNextDisabled={isNextDisabled}
        />
        <h2>
          <ScriptComparison
            recognizedText={recognizedText}
            currentParagraphIndex={currentParagraphIndex}
            referenceParagraphs={referenceParagraphs}
          />
        </h2>
      </div>
    </>
  );
}

export default SpeechToTextAnalyzer;
