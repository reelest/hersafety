import sentenceCase from "./sentenceCase";

export default function capitalize(e) {
  return e.split(" ").map(sentenceCase).join(" ");
}
