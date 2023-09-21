export default async function delay(duration) {
  return new Promise((r) => {
    setTimeout(r, duration);
  });
}
