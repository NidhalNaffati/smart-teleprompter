import {useEffect, useState} from "react";
import {IpcRenderer} from "electron";

const ipcRenderer: IpcRenderer = window.ipcRenderer;

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
    <button
      className={`font-sans text-base px-5 py-2 rounded-md cursor-not-allowed transition-colors ${
        isRunning ? "bg-green-500 text-white" : "bg-red-500 text-white"
      } dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
      disabled
    >
      <span className="mr-2">🎤 |</span> {isRunning ? "ON" : "OFF"}
    </button>
  );
}

export default MicState;
