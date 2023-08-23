import { useEffect } from "react";

export default function useLogger(val_wrapper) {
  useEffect(() => {
    console.table(val_wrapper);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(val_wrapper));
}
