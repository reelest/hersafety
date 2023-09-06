import range from "./range";
import uniq from "./uniq";

/**
 * Return a function that matches results with scores
 * @param {String} text
 */
export default function createQuery(text) {
    const [exact, oneLetterOff, twoLettersOff, letterSegments] =
        parseQuery(text);
    return function (label) {
        label = String(label).toLowerCase();
        return (
            baseScore(exact, label) * 49 +
            baseScore(oneLetterOff, label) * 7 +
            baseScore(twoLettersOff, label) / Math.log(label.length / 5) +
            baseScore(letterSegments, label) / (5 * Math.log(label.length / 5))
        );
    };
}
const baseScore = (query, text) =>
    query.reduce((score, part) => {
        return score + (text.includes(part) ? part.length : 0);
    }, 0);
const byLength = (a, b) => b.length - a.length || a.localeCompare(b);
const notIn = (arr) => (e) => !arr.includes(e);
const maxLength = (e) => e.length < 15;
/**
 *
 * @param {String} text
 * @returns
 */
export function parseQuery(text) {
    let exactMatch = text
        .toLowerCase()
        .split(/[ ,.]/)
        .filter(Boolean)
        .sort(byLength)
        .filter(uniq);
    const prev = exactMatch.slice();
    if (!exactMatch.every(maxLength)) {
        exactMatch = exactMatch
            .map(slice(14, Infinity))
            .flat()
            .concat(exactMatch.filter(maxLength))
            .sort(byLength)
            .filter(uniq);
    }
    const oneLetterOff = exactMatch
        .map(removeOneLetter)
        .flat()
        .sort(byLength)
        .filter(uniq)
        .filter(maxLength)
        .filter(notIn(prev));
    Array.prototype.push.apply(prev, oneLetterOff);

    const twoLettersOff = oneLetterOff
        .map(removeOneLetter)
        .flat()
        .sort(byLength)
        .filter(uniq)
        .filter(maxLength)
        .filter(notIn(prev));
    Array.prototype.push.apply(prev, twoLettersOff);

    const letterSegments = [];
    for (let i = 8; i > 0; i--)
        Array.prototype.push.apply(
            letterSegments,
            (i > 4 ? oneLetterOff : exactMatch)
                .map(slice(i, i * i))
                .flat()
                .sort(byLength)
                .filter(uniq)
                .filter(notIn(prev))
        );

    return [exactMatch, oneLetterOff, twoLettersOff, letterSegments];
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

/**
 *
 * @param {String} word
 * @returns
 */
const slice = (size, from) => (word) => {
    return word.length > size
        ? range(Math.min(from, word.length) - size + 1).map((i) =>
              word.slice(i, i + size)
          )
        : [];
};
