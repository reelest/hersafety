import { formatNumber } from "@/utils/formatNumber";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import Users from "./user.js";
import { getUser } from "@/logic/auth";

export class Complaint extends CountedItem {
  date = new Date();
  user = getUser()?.uid ?? "";
  title = "";
  description = "";
}

const Complaints = new CountedModel("complaints", Complaint, {
  [MODEL_ITEM_PREVIEW](item) {
    return {
      title: "#Paid " + formatNumber(item.amount),
    };
  },
  user: {
    type: "ref",
    refModel: Users,
    hidden: true,
  },
});
export default Complaints;
