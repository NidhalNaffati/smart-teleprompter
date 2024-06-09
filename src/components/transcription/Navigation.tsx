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
    <div className="flex justify-center space-x-4 p-4 bg-white dark:bg-zinc-900 rounded-md shadow-md">
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors dark:bg-blue-400 dark:hover:bg-blue-500"
      >
        Reset
      </button>
      <button
        onClick={goToPreviousParagraph}
        disabled={isPreviousDisabled}
        className={`px-4 py-2 rounded-md transition-colors ${
          isPreviousDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
            : "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500"
        }`}
      >
        ⬅️
      </button>
      <button
        onClick={goToNextParagraph}
        disabled={isNextDisabled}
        className={`px-4 py-2 rounded-md transition-colors ${
          isNextDisabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500"
            : "bg-green-500 text-white hover:bg-green-600 dark:bg-green-400 dark:hover:bg-green-500"
        }`}
      >
        ➡️
      </button>
    </div>
  );
};

export default Navigation;
