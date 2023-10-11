import { formatNumber } from "@/utils/formatNumber";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import Admins from "./admin";

export class Payment extends CountedItem {
  date = new Date();
  amount = 0;
  authorizedBy = "";
  method = "offline";
}

const Payments = new CountedModel("payments", Payment, {
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: "#Paid " + formatNumber(item.amount),
    };
  },
  authorizedBy: {
    type: "ref",
    refModel: Admins,
  },
});
export default Payments;
