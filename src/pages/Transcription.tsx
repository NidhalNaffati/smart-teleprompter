import VoskControl from "../components/VoskControl.tsx";
import SpeechToTextAnalyzer from "../components/SpeechToTextAnalyzer.tsx";

export default function Transcription() {
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