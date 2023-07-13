import { useRef, useState, useEffect } from "react";
import useListener from "./useListener";
export default function useScrollTop(ref, initial, _reducer) {
  const windowRef = useRef(window);
  const reducer = useRef();
  reducer.current = _reducer;
  const scroll = useRef(0);
  const [state, setState] = useState(initial);

  const onChangeScroll = function (e) {
    const old = scroll.current;
    const y = ref
      ? e.target.scrollTop
      : (document.scrollingElement || document.documentElement).scrollTop;
    if (old === y) {
      return;
    }
    scroll.current = y;
    setState(reducer.current(y, old, state));
  };
  useEffect(() => {
    if (ref && ref.current) onChangeScroll({ target: ref.current });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useListener(ref || windowRef, "scroll", onChangeScroll);

  return state;
}
