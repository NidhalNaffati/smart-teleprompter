import React from "react";
import "../styles/SpeechToTextAnalyzer.css";

interface NextParagraphProps {
  currentParagraphIndex: number;
  referenceParagraphs: string[];
}

const NextParagraph: React.FC<NextParagraphProps> = ({
  currentParagraphIndex,
  referenceParagraphs,
}) => {
  if (currentParagraphIndex < referenceParagraphs.length - 1) {
    return (
      <div className="next-paragraph">
        <h2>{referenceParagraphs[currentParagraphIndex + 1]}</h2>
      </div>
    );
  }
  return null;
};

export default NextParagraph;
