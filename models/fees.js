import { CountedModel } from "./lib/counted_model";
import { CountedItem } from "./lib/counted_item";

export class Fee extends CountedItem {
  title = "";
  amount = 0;
  description = "";
  scope = "";
}

export const Fees = new CountedModel("fees", Fee, {
  scope: {
    options: [
      { value: "", label: "Every student" },
      { value: "class", label: "Specific classes" },
    ],
  },
});
