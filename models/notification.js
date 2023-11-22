import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import Users from "./user.js";
import { getUser } from "@/logic/auth";

export class Notification extends CountedItem {
  date = new Date();
  user = getUser()?.uid ?? "";
  title = "";
  description = "";
}

const Notifications = new CountedModel("notifications", Notification, {
  user: {
    type: "ref",
    refModel: Users,
    hidden: true,
  },
});
export default Notifications;
