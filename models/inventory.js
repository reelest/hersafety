import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";

export class Drug extends CountedItem {
  name = "";
  price = 0;
  currentStock = 0;
}

const Drugs = new CountedModel("drugs", Drug, {
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: item.name,
    };
  },
});
export default Drugs;
