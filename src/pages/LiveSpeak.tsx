import React from "react";
import useTextAnalyzerHooks from "../hooks/useVoskHooks";
import VoskControl from "../components/transcription/VoskControl";

const LiveSpeak: React.FC = () => {
  const {recognizedText} = useTextAnalyzerHooks();

  return (
    <div className="min-h-screen p-4">
      <div className="vosk-control">
        <VoskControl/>
      </div>
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full mx-auto mt-4">
        <div>
          <p className="text-gray-800">{recognizedText}</p>
        </div>
      </div>
    </div>
  );
};

export default LiveSpeak;
