import "../styles/MicState.css";
import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";

const ipcRenderer = (window as any).ipcRenderer as IpcRenderer;

function MicState() {

  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    ipcRenderer.on("vosk-status", (_event, started) => {
      setIsRunning(started);
    });

    return () => {
      ipcRenderer.removeAllListeners("vosk-status");
    };
  }, []);

  return (
    <button className={`mic-icon ${isRunning ? "animated on" : "off"}`} disabled>
      🎤 | {isRunning ? "ON" : "OFF"}
    </button>
  );

}

export default MicState;
