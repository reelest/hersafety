import { HiddenField } from "./lib/model_types";
import { CountedModel } from "./lib/counted_model";
import { Fee } from "./fees";

export class Payment extends Fee {
  timeCreated = new Date();
  initiator = "";
  beneficiary = "";
  reversed = false;
  reversalComments = "";
  source = "manual";
}
const Payments = new CountedModel("payments", Payment, {
  timeCreated: {
    type: "datetime",
  },
  initiator: HiddenField,
  beneficiary: HiddenField,
  reversed: HiddenField,
  reversalComments: HiddenField,
  source: HiddenField,
});
export default Payments;
