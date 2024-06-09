import {useState, useEffect} from "react";
import {IpcRenderer} from "electron";
import MicState from "./MicState";

const ipcRenderer: IpcRenderer = window.ipcRenderer;

function VoskControl() {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    ipcRenderer.on("vosk-status", (_event, started) => {
      console.log("Received vosk-status event: ", started ? "started" : "stopped");
      setIsRunning(started);
      setIsLoading(false); // Stop loading when status is received
    });

    return () => {
      ipcRenderer.removeAllListeners("vosk-status");
    };
  }, []);

  function startVosk() {
    setIsLoading(true); // Start loading when the button is clicked
    ipcRenderer.send("start-recognition");
  }

  function stopVosk() {
    ipcRenderer.send("stop-recognition");
  }

  return (
    <div className="p-4 flex flex-col items-center">
      <button
        onClick={isRunning ? stopVosk : startVosk}
        disabled={isLoading}
        className={`mb-4 px-4 py-2 font-bold rounded-md transition-colors ${
          isLoading
            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
            : isRunning
              ? "bg-red-500 text-white hover:bg-red-600 dark:bg-red-400 dark:hover:bg-red-500"
              : "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500"
        }`}
      >
        {isLoading ? "Loading..." : isRunning ? "Stop Vosk" : "Start Vosk"}
      </button>
      <MicState/>
    </div>
  );
}

export default VoskControl;
