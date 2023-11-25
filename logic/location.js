import createSubscription from "@/utils/createSubscription";
import { noop } from "@/utils/none";
import { onUser } from "./auth";
import Locations from "@/models/location";
import { hoursToMs, minutesToMs } from "@/utils/time_utils";
import isServerSide from "@/utils/is_server_side";
import { getPanic, onPanicChange } from "./panic_alert";

/** @type {import("@/utils/createSubscription").Subscription<import("@/models/lib/model").Fields<Location>>} */
export const [useLocation, onLocationChange, , getLocation] =
  createSubscription(function (setLocation) {
    if (isServerSide) return;
    onPanicChange(function (panic) {
      if (panic) {
        const m = navigator.geolocation.watchPosition(
          function (e) {
            setLocation({
              lat: e.coords.latitude,
              lng: e.coords.longitude,
              time: new Date(),
            });
          },
          function () {
            alert("Failed to get location");
          }
        );

        return () => navigator.geolocation.clearWatch(m);
      } else {
        return onLocationUpdateIntervalChange((interval) => {
          let m = setInterval(function () {
            navigator.geolocation.getCurrentPosition(
              function (e) {
                setLocation({
                  lat: e.coords.latitude,
                  lng: e.coords.longitude,
                  time: new Date(),
                });
              },
              function () {
                alert("Failed to get location");
              }
            );
          }, interval);
          return () => clearTimeout(m);
        });
      }
    });
  }, null);

export const [
  useLocationUpdateInterval,
  onLocationUpdateIntervalChange,
  setLocationUpdateInterval,
  getLocationUpdateInterval,
] = createSubscription(noop, minutesToMs(10));

/**
 * @type {import("@/utils/createSubscription").Subscription<Location>}
 */
export const [useActiveLocation, onActiveLocationChange, , getActiveLocation] =
  createSubscription((setActiveLocation) =>
    onLocationChange((currentLocation) => {
      return onUser((user) => {
        if (!user || !currentLocation) return setActiveLocation(null);
        const m = Locations.item(
          user.uid +
            "-" +
            cyclicTime(getPanic() ? 1000 : getLocationUpdateInterval()),
          true
        );
        m.set(currentLocation).then(() => setActiveLocation(m));
      });
    })
  );
onActiveLocationChange(noop);
const cyclicTime = (interval, wrapRange = hoursToMs(24)) =>
  Math.floor((Date.now() % wrapRange) / interval) * interval;
