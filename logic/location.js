import createSubscription from "@/utils/createSubscription";
import { noop } from "@/utils/none";

export const [useLocation, onLocationChange, setLocation, getLocation] =
  createSubscription(noop, { lat: -1, lng: -1 });

export const [
  useActiveLocation,
  onActiveLocationChange,
  setActiveLocation,
  getActiveLocation,
] = createSubscription(() => onLocationChange((e)=>{

  return Locations.item()
});
