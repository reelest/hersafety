import { memo, useEffect, useRef } from "react";
import useWindowRef from "@/utils/useWindowRef";
import useListener from "@/utils/useListener";

/**
 *
 * @param {import("react").SVGProps & {windowOffset: number}} props
 */
function Sketch(props) {
  const ref = useRef();
  const windowRef = useWindowRef();
  const paths = useRef();
  useEffect(() => {
    if (ref.current) {
      const x = ref.current.getElementsByTagName("path");
      const c = [];
      for (let i = 0; i < x.length; i++) c[i] = x.item(i);
      paths.current = c;
      sketch(paths.current, getPercent(ref.current, props.windowOffset ?? 200));
    } else paths.current = null;
  }, [ref, props.windowOffset]);
  useListener(windowRef, "scroll", () => {
    if (paths.current)
      sketch(paths.current, getPercent(ref.current, props.windowOffset ?? 200));
  });
  return <svg ref={ref} {...props} />;
}

/**
 * @param {HTMLElement} el
 * @param {number} windowOffset
 */
function getPercent(el, windowOffset) {
  const size = window.innerHeight - (windowOffset ?? 200);
  const rect = el.getBoundingClientRect();
  const top = rect.top;
  const bottom = rect.bottom;
  if (top > window.innerHeight || bottom < 0) return -1;
  return size > 100 ? Math.min(1, Math.max(0, 1 - top / size)) : 1;
}

export function sketch(paths, percent) {
  if (percent < 0) return;
  const progress = paths.length * percent;
  const index = Math.floor(progress);
  const path = index < paths.length && paths[index];
  const l = path && path.getTotalLength();
  for (let i = 0; i < index; i++) {
    paths[i].style.opacity = 1;
    paths[i].style.strokeDashoffset = 0;
  }
  for (let i = index + 1; i < paths.length; i++) {
    paths[i].style.opacity = 0;
  }
  if (path) {
    const progress2 = progress - index;
    path.style.opacity = 1;
    path.style.strokeDasharray = l;
    path.style.strokeDashoffset = Math.floor(l * (1 - progress2));
  }
}

export default memo(Sketch);
