import "./styles/App.css";
import SpeechToTextAnalyzer from "./components/SpeechToTextAnalyzer.tsx";
import VoskControl from "./components/VoskControl.tsx";
import Webcam from "react-webcam";

function App() {
  return (
    <>
      <div className="vosk-control">
        <VoskControl/>
      </div>
      <div>
        <Webcam
          audio={false}
          mirrored={true}
          height={240}
          width={360}
        />
      </div>
      <div>
        <SpeechToTextAnalyzer/>
      </div>
    </>
  );
}

export default App;
