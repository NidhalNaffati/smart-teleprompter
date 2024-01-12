import "./styles/App.css";
import SpeechToTextAnalyzer from "./components/SpeechToTextAnalyzer.tsx";
import VoskControl from "./components/VoskControl.tsx";

function App() {
  return (
    <>
      <div className="vosk-control">
        <VoskControl/>
      </div>
      <div>
        <SpeechToTextAnalyzer/>
      </div>
    </>
  );
}

export default App;
