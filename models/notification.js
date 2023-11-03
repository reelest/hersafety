

import { formatNumber } from "@/utils/formatNumber";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import Clients from "./client.js";

export class Notification extends CountedItem {
  date = new Date();
  user = getUser()?.uid ?? ""
  title = "";
  description = "";
}

const Notifications = new CountedModel("payments", Notification, {
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: "#Paid " + formatNumber(item.amount),
    };
  },
  user: {
    type: "ref",
    refModel: Clients,
    hidden: true
  },
});
export default Notifications;
