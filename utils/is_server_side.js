const isServerSide =
  typeof window === "undefined" || !window.location || !window.document;
export default isServerSide;

export const inDevelopment = process && process.env.NODE_ENV === "development";
