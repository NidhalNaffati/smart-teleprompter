import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/electron-vite.animate.svg";
import "./App.css";
import { IpcRenderer } from "electron";

const ipcRenderer = (window as any).ipcRenderer as IpcRenderer;

function App() {
  const [recognizedText, setRecognizedText] = useState("");

  // Listen for messages from the main process and update the state when received
  useEffect(() => {
    ipcRenderer.on("recognized-text", (_event, text) => {
      console.log("text", text);
      setRecognizedText(text);
    });

    return () => {
      ipcRenderer.removeAllListeners("recognized-text");
    };
  }, []);

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
        <h1>Recognized Text:</h1>
        <p>{recognizedText}</p>
      </div>
    </>
  );
}

export default App;
