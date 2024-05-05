import VoskControl from "../components/transcription/VoskControl.tsx";
import SpeechToTextAnalyzer from "../components/transcription/SpeechToTextAnalyzer.tsx";

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