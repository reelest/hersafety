const isServerSide =
  typeof window === "undefined" || !window.location || !window.document;
export default isServerSide;
