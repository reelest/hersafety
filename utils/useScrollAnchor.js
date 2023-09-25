import { useEffect, useRef } from "react";
export default function useScrollAnchor(tag) {
  const topElement = useRef();
  useEffect(() => {
    topElement.current?.scrollIntoViewIfNeeded?.();
  }, [tag]);
  return <div className="invisible" ref={topElement} />;
}
