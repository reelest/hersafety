import { CountedItem, CountedModel } from "./lib/counted_model";

export class Fee extends CountedItem {
  title = "";
  amount = 0;
  description = 0;
  scope = "";
}

export const WebsiteDataModel = new CountedModel("fees", Fee, {
  scope: {
    options: [
      { value: "", label: "Every student" },
      { value: "class", label: "Specific classes" },
    ],
  },
});
