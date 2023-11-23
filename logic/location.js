import createSubscription from "@/utils/createSubscription";
import { noop } from "@/utils/none";
import { onUser } from "./auth";
import Locations from "@/models/location";

export const [useLocation, onLocationChange, setLocation, getLocation] =
  createSubscription(noop, { lat: -1, lng: -1 });

export const [
  useActiveLocation,
  onActiveLocationChange,
  setActiveLocation,
  getActiveLocation,
] = createSubscription(() =>
  onLocationChange((e) => {
    onUser((user) => {
      if (!user || !e) return null;
      return Locations.item();
    });
  })
);
