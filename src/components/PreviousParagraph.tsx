import React from "react";
import "../styles/SpeechToTextAnalyzer.css";

interface PreviousParagraphProps {
  currentParagraphIndex: number;
  referenceParagraphs: string[];
}

const PreviousParagraph: React.FC<PreviousParagraphProps> = ({
  currentParagraphIndex,
  referenceParagraphs,
}) => {
  if (currentParagraphIndex > 0) {
    return (
      <div className="previous-paragraph">
        <h2>{referenceParagraphs[currentParagraphIndex - 1]}</h2>
      </div>
    );
  }
  return null;
};

export default PreviousParagraph;
