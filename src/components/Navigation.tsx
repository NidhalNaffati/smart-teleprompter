import React from "react";

interface NavigationProps {
  goToPreviousParagraph: () => void;
  goToNextParagraph: () => void;
  reset: () => void;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
}

const Navigation: React.FC<NavigationProps> = ({
  goToPreviousParagraph,
  goToNextParagraph,
  reset,
  isPreviousDisabled,
  isNextDisabled,
}) => {
  return (
    <div>
      <button onClick={reset}>Reset</button>
      <button onClick={goToPreviousParagraph} disabled={isPreviousDisabled}>
        ⬅️
      </button>
      <button onClick={goToNextParagraph} disabled={isNextDisabled}>
        ➡️
      </button>
    </div>
  );
};

export default Navigation;
