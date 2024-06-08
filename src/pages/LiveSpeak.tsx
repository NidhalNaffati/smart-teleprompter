import React from "react";
import useTextAnalyzerHooks from "../hooks/useVoskHooks"
import VoskControl from "../components/transcription/VoskControl.tsx";

const LiveSpeak: React.FC = () => {
  const {recognizedText} = useTextAnalyzerHooks();

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="vosk-control">
        <VoskControl/>
      </div>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full mx-auto mt-4">
        <div>
          <p className="text-gray-600">{recognizedText}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveSpeak;
