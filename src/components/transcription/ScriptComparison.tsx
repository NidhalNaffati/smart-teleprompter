import React from "react";
import {isWordSimilar} from "../../utils/word-similarity.ts";

interface ComparisonProps {
  currentParagraphIndex: number;
  referenceParagraphs: string[];
  recognizedText: string;
}

const ScriptComparison: React.FC<ComparisonProps> = ({
  currentParagraphIndex,
  referenceParagraphs,
  recognizedText,
}) => {
  const referenceParagraph = referenceParagraphs[currentParagraphIndex];
  const referenceWords = referenceParagraph.split(" ");
  const recognizedWords = recognizedText.split(" ");

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md">
      {referenceWords.map((referenceWord, i) => {
        const userWord = recognizedWords[i];
        const isWordSpelledCorrectly = isWordSimilar(userWord, referenceWord, 70);

        return (
          <span
            key={i}
            className={`text-xl font-mono transition-colors ${
              isWordSpelledCorrectly ? "text-green-500" : "text-red-500"
            } ${i === recognizedWords.length - 1 ? "underline" : ""}`}
          >
            {referenceWord}{" "}
          </span>
        );
      })}
    </div>
  );
};

export default ScriptComparison;
