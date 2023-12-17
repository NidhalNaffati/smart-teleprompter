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

export {resetTextStateVariables};