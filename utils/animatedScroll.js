import { animate } from "framer-motion";
import { useEffect, useState } from "react";

const useAnimatedScroll = function () {
  const [scrollOpts, setScrollTarget] = useState({
    element: null,
    targetScroll: 0,
  });
  useEffect(() => {
    const { targetScroll, element } = scrollOpts;
    if (!element || targetScroll === element.scrollTop) return;
    const controls = animate(element.scrollTop, targetScroll, {
      duration: 0.5,
      onUpdate(value) {
        element.scrollTop = value;
      },
    });
    return () => controls.stop();
  }, [scrollOpts]);
  return setScrollTarget;
};
export default useAnimatedScroll;
