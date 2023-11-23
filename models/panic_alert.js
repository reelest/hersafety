import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import Locations from "./location";
import Users from "./user.js";
import { getUser } from "@/logic/auth";

export class PanicAlert extends CountedItem {
  user = getUser()?.uid ?? "";
  timeStarted = new Date();
  locationStarted = getActiveLocation()?.id?.() ?? "";
  stopped = false;
}

const PanicAlerts = new CountedModel("panic_alert", PanicAlert, {
  user: {
    type: "ref",
    refModel: Users,
    hidden: true,
  },
  locationStarted: {
    type: "ref",
    refModel: null,
  },
});

PanicAlerts.hasOneOrMore(Locations, null, { field: "locationStarted" });
export default PanicAlerts;
