import { useState } from "react";
import useStable from "./useStable";

export default function useRefresher() {
  const [state, setState] = useState(0);
  const refresh = useStable(() => setState(state + 1));
  return [state, refresh];
}
