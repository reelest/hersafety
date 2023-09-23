import useScrollTop from "@/utils/useScrollTop";
import "./gsap_parallax_layer.css";
import gsap from "gsap";
import { useCallback, useRef } from "react";

export default function GsapParallaxLayer({ multiplier = 0.1, children }) {
  useScrollTop(
    null,
    useCallback(
      function (scrollY) {
        gsap.to(ref.current, {
          y: -scrollY * multiplier,
          ease: "linear",
          overwrite: true,
        });
      },
      [multiplier]
    )
  );
  const ref = useRef();
  return (
    <div ref={ref} className="parallax_layer">
      {children}
    </div>
  );
}
