import { Hidden } from "./lib/model_types";
import { CountedModel } from "./lib/counted_model";
import { Fee } from "./fees";

export class Payment extends Fee {
  timestamp = Date.now();
  initiator = "";
  beneficiary = "";
  reversed = false;
  reversalComments = "";
  source = "manual";
}
const Payments = new CountedModel("payments", Payment, {
  timestamp: {
    type: "datetime",
  },
  initiator: Hidden,
  beneficiary: Hidden,
  reversed: Hidden,
  reversalComments: Hidden,
  source: Hidden,
});
export default Payments;
