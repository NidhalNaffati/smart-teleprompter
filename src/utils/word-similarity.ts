/**
 * Calculates the Levenshtein distance between two input strings.
 *
 * The Levenshtein distance represents the minimum number of single-character
 * edits (insertions, deletions, or substitutions) required to transform one
 * string into another.
 *
 * @param {string} firstWord - The first input string.
 * @param {string} secondWord - The second input string.
 * @returns {number} Returns the Levenshtein distance between `firstWord` and `secondWord`.
 *
 * @example
 * const distance = calculateLevenshteinDistance("kitten", "sitting");
 * console.log(distance); // Output: 3
 */
const calculateLevenshteinDistance = (
  firstWord: string,
  secondWord: string
): number => {
  // Step 1: Check for base cases
  if (!firstWord.length) return secondWord.length;
  if (!secondWord.length) return firstWord.length;

  const arr: number[][] = [];

  for (let i = 0; i <= secondWord.length; i++) {
    arr[i] = [i];
    for (let j = 1; j <= firstWord.length; j++) {
      // Step 2: Populate the 2D array with Levenshtein distances
      arr[i][j] =
        i === 0
          ? j
          : Math.min(
              arr[i - 1][j] + 1,
              arr[i][j - 1] + 1,
              arr[i - 1][j - 1] +
                (firstWord[j - 1] === secondWord[i - 1] ? 0 : 1)
            );
    }
  }

  // Step 3: Calculate the Levenshtein distance between the two words
  return arr[secondWord.length][firstWord.length];
};


/**
 * Determines whether two words are similar based on the Levenshtein distance
 * and a specified similarity percentage threshold.
 *
 * @param {string | undefined} userWord - The user-provided word for comparison.
 * @param {string} referenceWord - The reference word to compare against.
 * @param {number} percentage - The minimum required similarity percentage.
 * @returns {boolean} Returns true if the similarity percentage is greater than or equal to the specified threshold.
 *
 * @example
 * const similar = isWordSimilar("kitten", "sitting", 60);
 * console.log(similar); // Output: true
 */
export const isWordSimilar = (
  userWord: string,
  referenceWord: string,
  percentage: number
): boolean => {
  // Step 1: Handle the case where userWord is undefined (e.g., no user input yet)
  if (userWord === undefined) {
    return false;
  }

  // Step 2: Calculate the maximum possible distance
  const maxPossibleDistance: number = Math.max(
    userWord.length,
    referenceWord.length
  );

  // Step 3: Calculate the Levenshtein distance between the two words
  const levenshteinDistance: number = calculateLevenshteinDistance(
    userWord,
    referenceWord
  );

  // Step 4: Calculate the similarity percentage
  const similarityPercentage: number =
    ((maxPossibleDistance - levenshteinDistance) / maxPossibleDistance) * 100;

  similarityPercentage.toFixed(2);

  // Step 5: Compare with the provided percentage and return a boolean
  return similarityPercentage >= percentage;
};
