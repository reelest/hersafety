import { useState } from "react";

export default function useToggler(initial = false) {
  const [state, setState] = useState(initial);
  return [state, () => setState(true), () => setState(false)];
}
