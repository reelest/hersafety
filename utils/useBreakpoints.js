import useWindowSize from "./useWindowSize";

export default function useBreakpoints() {
  const windowWidth = useWindowSize().width;
  return {
    xs: windowWidth < 640,
    sm: windowWidth >= 640,
    md: windowWidth >= 768,
    lg: windowWidth >= 1024,
    xl: windowWidth >= 1280,
    "2xl": windowWidth >= 1536,
    _2xl: windowWidth >= 1536,
    stop: ["xs", "sm", "md", "lg", "xl", "2xl"][
      [640, 768, 1024, 1280, 1536, Infinity].findIndex((e) => windowWidth < e)
    ],
  };
}
