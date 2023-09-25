import { useEffect, useState } from "react";

export default function useArrayState(array) {
  const [state, setState] = useState(array?.[0]);
  useEffect(() => {
    if (array && !array.includes(state)) setState(array[0]);
  }, [array, state]);
  return [state, setState];
}
