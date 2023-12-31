import React from "react";
import {isWordSimilar} from "../utils/word-similarity.ts";
import "../styles/SpeechToTextAnalyzer.css";

interface ComparisonProps {
  currentParagraphIndex: number;
  referenceParagraphs: string[];
  recognizedText: string;
}

const CurrentParagraphComparison: React.FC<ComparisonProps> = ({
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
            className={`comparison-word ${
              isWordSpelledCorrectly ? "matched" : "mismatched"} ${i === recognizedWords.length - 1 ? "underline" : ""}`}
          >
            {referenceWord}{" "}
          </span>
        );
      })}
    </>
  );
};

export default CurrentParagraphComparison;
