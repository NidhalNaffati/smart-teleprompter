import {useState} from "react";
import {IpcRenderer} from "electron";

const ipcRenderer = (window as any).ipcRenderer as IpcRenderer;

function VoskControl() {
  const [isRunning, setIsRunning] = useState(false);

  function startVosk() {
    // Send a message to the main process to start the Vosk process
    ipcRenderer.send("start-recognition");

    // Update the state to indicate that Vosk is running
    setIsRunning(true);
  }

  function stopVosk() {
    // Send a message to the main process to stop the Vosk process
    ipcRenderer.send("stop-recognition");

    // Update the state to indicate that Vosk is not running
    setIsRunning(false);
  }

  return (
    <div>
      <button onClick={isRunning ? stopVosk : startVosk}>
        {isRunning ? "Stop Vosk" : "Start Vosk"}
      </button>
    </div>
  );
}

export default VoskControl;
