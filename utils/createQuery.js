import range from "./range";

/**
 * Return a function that matches results with scores
 * @param {String} text
 */
export default function createQuery(text) {
  const exact = text.toLowerCase().split(/[ ,.]/).filter(Boolean);
  const oneLetterOff = exact.map(removeOneLetter).flat();
  const twoLettersOff = oneLetterOff.map(removeOneLetter).flat();
  return function (label) {
    label = String(label).toLowerCase();
    return (
      (exact.reduce((score, part) => {
        return score + (label.includes(part) ? part.length : 0);
      }, 0) *
        49 +
        oneLetterOff.reduce((score, part) => {
          return score + (label.includes(part) ? part.length : 0);
        }, 0) *
          7 +
        twoLettersOff.reduce((score, part) => {
          return score + (label.includes(part) ? part.length : 0);
        }, 0)) /
      Math.log(label.length / 5)
    );
  };
}

/**
 *
 * @param {String} word
 * @returns
 */
const removeOneLetter = (word) => {
  return word.length > 1
    ? range(word.length).map((i) => word.slice(0, i) + word.slice(i + 1))
    : [];
};
