import { useState } from "react";

export default function useDisableOnClick(func, enableOnSuccess = false) {
  let [enabled, setEnabled] = useState(true);
  return [
    !enabled,
    function (...data) {
      if (enabled) {
        setEnabled(false);
        func(...data).then(
          function () {
            if (enableOnSuccess) setEnabled(true);
          },
          function (err) {
            setEnabled(true);
            throw err;
          }
        );
      }
    },
  ];
}
