import React from "react";
import {isWordSimilar} from "../utils/word-similarity.ts";

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
    <>
      {referenceWords.map((referenceWord, i) => {
        const userWord = recognizedWords[i];
        const isWordSpelledCorrectly = isWordSimilar(
          userWord,
          referenceWord,
          70
        );

        return (
          <span
            key={i}
            className={`text-2xl transition-colors ${
              isWordSpelledCorrectly ? "text-green-500" : "text-red-500"
            } ${
              i === recognizedWords.length - 1 ? "underline" : ""
            }`}
          >
            {referenceWord}{" "}
          </span>
        );
      })}
    </>
  );
};

export default ScriptComparison;
