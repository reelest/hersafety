import { hoursToMs, minutesToMs } from "@/utils/time_utils";
import useInterval from "@/utils/useInterval";
import useLocalStorage, { useSetLocalStorage } from "@/utils/useLocalStorage";
import { useState } from "react";

export default function DebugTimer() {
  const deadLine = Date.parse(
    useLocalStorage("deadline") || new Date().toString()
  );
  const setDeadLine = useSetLocalStorage("deadline");
  const [now, trigger] = useState(null);
  useInterval(() => trigger(Date.now()), 1000);
  const delta = deadLine - now;
  const hours = Math.floor(delta / hoursToMs(1));
  const minutes = Math.floor(delta / minutesToMs(1)) % 60;
  const seconds = Math.floor(delta / 1000) % 60;
  if (!now) return null;
  return (
    <div
      className="fixed right-0 top-0"
      style={{
        opacity: 0.2,
        fontSize: 14,
        color: delta > 0 ? "green" : "red",
      }}
    >
      <span className="py-4 px-2">{hours}</span>
      <span className="py-4 px-2">{minutes}</span>
      <span className="py-4 px-2">{seconds}</span>
      <form
        className="inline-block"
        onSubmit={(e) => {
          e.preventDefault();
          setDeadLine(
            new Date(
              Date.now() + hoursToMs(parseFloat(e.target.firstChild.value))
            )
          );
        }}
      >
        <input
          type="number"
          placeholder="Enter hours from now"
          style={{ background: "none", marginLeft: 5, border: "none" }}
        />
      </form>
    </div>
  );
}
