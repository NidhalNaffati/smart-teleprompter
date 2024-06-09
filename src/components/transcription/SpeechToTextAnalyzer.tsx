import {ChangeEvent, useState} from "react";
import ScriptComparison from "./ScriptComparison";
import Navigation from "./Navigation";
import useTextAnalyzerHooks from "../../hooks/useTextAnalyzerHooks";
import VoskControl from "./VoskControl";

function SpeechToTextAnalyzer() {

  // State for reference text
  const [referenceText, setReferenceText] = useState<string>("");
  const referenceParagraphs: string[] = referenceText.split("\n");
  const [isReferenceTextReady, setIsReferenceTextReady] = useState<boolean>(false);

  const {
    recognizedText,
    currentParagraphIndex,
    handleResetClick,
    goToNextParagraph,
    goToPreviousParagraph,
  } = useTextAnalyzerHooks(referenceParagraphs);

  const isNextDisabled = currentParagraphIndex === referenceParagraphs.length - 1;
  const isPreviousDisabled = currentParagraphIndex === 0;

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setReferenceText(event.target.value);
  };

  return (
    <div className="p-6">
      <div className={`flex flex-col items-center justify-center ${isReferenceTextReady ? "hidden" : "block"}`}>
        <textarea
          value={referenceText}
          onChange={handleInputChange}
          rows={10}
          cols={50}
          placeholder="Enter reference text here"
          className="w-full max-w-2xl outline-none text-lg px-8 py-5 caret-yellow-500 bg-white dark:bg-zinc-800 text-black dark:text-white rounded-md shadow-md"
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-2"
          onClick={() => setIsReferenceTextReady(true)}
        >
          Finish
        </button>
      </div>

      <div className={`${isReferenceTextReady ? "block" : "hidden"} flex flex-col items-center`}>
        <div className="flex items-center justify-center m-6">
          <Navigation
            goToPreviousParagraph={goToPreviousParagraph}
            goToNextParagraph={goToNextParagraph}
            reset={handleResetClick}
            isPreviousDisabled={isPreviousDisabled}
            isNextDisabled={isNextDisabled}
          />
        </div>

        <div className="mb-8 mx-auto">
          <VoskControl/>
        </div>

        <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-zinc-100">
          <ScriptComparison
            recognizedText={recognizedText}
            currentParagraphIndex={currentParagraphIndex}
            referenceParagraphs={referenceParagraphs}
          />
        </h2>
      </div>
    </div>
  );
}

export default SpeechToTextAnalyzer;
