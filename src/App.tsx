import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import "./App.css";
import { IpcRenderer } from "electron";
import { isWordSimilar } from "./utils/wordSimilarity";

const ipcRenderer = (window as any).ipcRenderer as IpcRenderer;

function App() {
  const [, setRecognizedText] = useState<string>("");
  const [userWords, setUserWords] = useState<string[]>([]);

  // Listen for messages from the main process and update the state when received
  useEffect(() => {
    ipcRenderer.on("recognized-text", (_event, text) => {
      console.log("text", text);
      setRecognizedText(text);

      // Split the recognized text into words
      const recognizedWords = text.split(" ");
      setUserWords(recognizedWords);
    });

    return () => {
      ipcRenderer.removeAllListeners("recognized-text");
    };
  }, []);

  const referenceText: string =
    "hello everyone today we are going to discuss how this application works and how we can improve it in the future";
  const referenceWords: string[] = referenceText.split(" ");

  const renderComparison = () => {
    return referenceWords.map((referenceWord, i) => {
      const userWord = userWords[i];

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
        <span key={i} style={{ color, fontWeight }}>
          {referenceWord}{" "}
        </span>
      );
    });
  };

  return (
    <>
      <div>
        <div>
          <a href="https://electron-vite.github.io" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
      </div>

      <div>
        <h2>{renderComparison()}</h2>
      </div>
    </>
  );
}

export default App;
