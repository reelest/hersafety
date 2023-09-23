const WINDOW_REF = {
  current: typeof window !== "undefined" && window,
};
export default function useWindowRef() {
  return WINDOW_REF;
}
