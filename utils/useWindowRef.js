import { useRef } from "react";
import isServerSide from "./is_server_side";

export default function useWindowRef() {
  return useRef(isServerSide ? null : window);
}
