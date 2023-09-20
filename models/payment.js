import { HiddenField } from "./lib/model_types";
import { CountedModel } from "./lib/counted_model";
import { Fee } from "./fees";

export class Payment extends Fee {
  fee = "";
  timeCreated = new Date();
  initiator = "";
  beneficiary = "";
  reversed = false;
  reversalComments = "";
  paymentMethod = "manual";
}
const Payments = new CountedModel("payments", Payment, {
  timeCreated: {
    type: "datetime",
  },
  fee: {
    type: "ref",
    required: false,
  },
  initiator: HiddenField,
  beneficiary: HiddenField,
  reversed: HiddenField,
  reversalComments: HiddenField,
  paymentMethod: HiddenField,
});
export default Payments;
