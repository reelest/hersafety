import range from "./range";
import uniq from "./uniq";

/**
 * Return a function that matches results with scores
 * @param {String} text
 */
export default function createQuery(text) {
  const [exact, oneLetterOff, twoLettersOff, fourLetterCombos] =
    parseQuery(text);
  return function (label) {
    label = String(label).toLowerCase();
    return (
      baseScore(exact, label) * 49 +
      baseScore(oneLetterOff, label) * 7 +
      baseScore(twoLettersOff, label) / Math.log(label.length / 5) +
      baseScore(fourLetterCombos, label) / (5 * Math.log(label.length / 5))
    );
  };
}
const baseScore = (query, text) =>
  query.reduce((score, part) => {
    return score + (text.includes(part) ? part.length : 0);
  }, 0);
const byLength = (a, b) => a.length - b.length;
const notIn = (arr) => (e) => !arr.includes(e);

export function parseQuery(text) {
  const exactMatch = text
    .toLowerCase()
    .split(/[ ,.]/)
    .filter(Boolean)
    .sort(byLength)
    .filter(uniq);
  const oneLetterOff = exactMatch
    .map(removeOneLetter)
    .flat()
    .filter(notIn(exactMatch))
    .filter(uniq);
  const twoLettersOff = oneLetterOff
    .map(removeOneLetter)
    .flat()
    .filter(notIn(exactMatch.concat(oneLetterOff)))
    .filter(uniq);
  const fourLetterCombos = twoLettersOff
    .map(findFourLetters)
    .flat()
    .filter(notIn(exactMatch.concat(twoLettersOff)))
    .filter(uniq);
  return [exactMatch, oneLetterOff, twoLettersOff, fourLetterCombos];
}
/**
 *
 * @param {String} word
 * @returns
 */
export const removeOneLetter = (word) => {
  return word.length > 1
    ? range(word.length).map((i) => word.slice(0, i) + word.slice(i + 1))
    : [];
};

/**
 *
 * @param {String} word
 * @returns
 */
export const findFourLetters = (word) => {
  return word.length > 4
    ? range(word.length - 3).map((i) => word.slice(i, i + 4))
    : [];
};
