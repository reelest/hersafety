import { createSharedQuery } from "@/models/lib/query";
import PanicAlerts, { PanicAlert } from "@/models/panic_alert";
import createSubscription from "@/utils/createSubscription";
import { getUser, onUser } from "./auth";

/**
 * @type {import("@/utils/createSubscription").Subscription<PanicAlert>}
 */
export const [usePanic, onPanicChange, , getPanic] = createSubscription(
  (setPanic) => {
    return onUser((user) => {
      if (!user) return setPanic(null);
      const [, onData] = createSharedQuery(
        PanicAlerts.withFilter(
          "user",
          "==",
          user.uid,
          "stopped",
          "==",
          false
        ).orderBy("timeStarted", false),
        { watch: true }
      );
      return onData(({ data }) => {
        setPanic(data && data.length ? data[0] : false);
      });
    });
  },
  null
);

export const stopPanic = async function () {
  const m = getPanic();
  if (m) {
    await m.set({ stopped: true });
  }
};

export const startPanic = async function () {
  const currentLocation = (await import("./location")).getActiveLocation();
  await PanicAlerts.create().set({
    user: getUser().uid,
    locationStarted: currentLocation?.id?.(),
  });
};
import("./location");
