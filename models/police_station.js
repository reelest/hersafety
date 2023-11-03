
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";

export class PoliceStation extends CountedItem {
  name = "";
  phoneNumber = "";
  address = "";
}

const PoliceStations = new CountedModel("police_station", PoliceStation, {
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: item.name,
    };
  },
});
export default Drugs;
