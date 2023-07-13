export default function sentenceCase(s) {
  return String(s)
    .toLowerCase()
    .replace(/^./, (e) => e.toUpperCase());
}
