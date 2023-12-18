import {isWordSimilar} from "./word-similarity.ts";

/**
 * Resets the relevant state variables to empty strings.
 *
 * @param {Function} setRecognizedText - The state setter for recognized text.
 * @param {Function} setLastRecognizedText - The state setter for the last recognized text.
 * @param {Function} setStartingWord - The state setter for the starting word.
 */
function resetTextStateVariables(
  setRecognizedText: (text: string) => void,
  setLastRecognizedText: (text: string) => void,
  setStartingWord: (word: string) => void
): void { // Resets relevant state variables to empty strings.
  setRecognizedText("");
  setLastRecognizedText("");
  setStartingWord("");
}

/**
 * Checks if the current paragraph has been completed.
 * If it has, go to the next paragraph.
 * Otherwise, do nothing.
 *
 * @param recognizedText
 * @param {number} currentParagraphIndex - The index of the current paragraph.
 * @param {string[]} referenceParagraphs - The array of reference paragraphs.
 * @param goToNextParagraph
 * @returns {boolean} - Whether the current paragraph has been completed.
 */
function goToNextParagraphIfTheCurrentOneIsCompleted(
  recognizedText: string,
  currentParagraphIndex: number,
  referenceParagraphs: string[],
  goToNextParagraph: () => void
): void {
  // get the last three words of the reference paragraph
  const referenceWords = referenceParagraphs[currentParagraphIndex].split(" ");
  const lastThreeWordsReference = referenceWords.slice(-3).join(" ");
  const lastThreeWordsRecognized = recognizedText.split(" ").slice(-3).join(" ");

  // check if the last three words of the recognized text match the last three words of the reference paragraph
  // the comparison is done by the Levenshtein distance algorithm, so we allow for some typos
  const isParagraphCompleted: boolean = isWordSimilar(lastThreeWordsRecognized, lastThreeWordsReference, 50);

  // if the paragraph is completed, go to the next paragraph
  if (isParagraphCompleted) {
    goToNextParagraph();
  }
}


export {resetTextStateVariables, goToNextParagraphIfTheCurrentOneIsCompleted};