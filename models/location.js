import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { USES_EXACT_IDS } from "./lib/model";

export class Location extends CountedItem {
  lat = -1;
  lng = -1;
  time = new Date();
}

const Locations = new CountedModel("location", Location, {
  [USES_EXACT_IDS]: true,
  lat: {
    label: "Latitude",
  },
  lng: {
    label: "Longitude",
  },
});

export default Locations;
