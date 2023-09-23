import { useState } from "react";
import useListener from "./useListener";
import useWindowRef from "./useWindowRef";
import isServerSide from "./is_server_side";

export default function useWindowSize() {
  const getSize = () => ({
    height: isServerSide ? 600 : window.innerHeight,
    width: isServerSide ? 1280 : window.innerWidth,
  });
  const [size, setSize] = useState(getSize);
  useListener(useWindowRef(), "resize", () => setSize(getSize()));
  return size;
}
