import { useEffect } from "react";

export default function useLogger(val_wrapper) {
  useEffect(() => {
    console.log(
      Object.keys(val_wrapper)
        .map((e) => e + "=" + val_wrapper[e])
        .join(", ")
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(val_wrapper));
}
