import { formatNumber } from "@/utils/formatNumber";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";

export class Payment extends CountedItem {
  amount = 0;
  date = new Date();
}

const Payments = new CountedModel("m_payments", Payment, {
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: "#Paid " + formatNumber(item.amount),
    };
  },
});
export default Payments;
