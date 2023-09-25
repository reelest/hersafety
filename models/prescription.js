import Drugs from "./inventory";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";

class Prescription extends CountedItem {
  drugs = [];
}
class DrugDetail extends CountedItem {
  drug = "";
  amount = 0;
}
const DrugDetails = new CountedModel("drug_details", DrugDetail);

const Prescriptions = new CountedModel("prescriptions", Prescription, {
  drug: {
    type: "array",
    arrayType: {
      type: "ref",
      refModel: DrugDetails,
      pickRefQuery: DrugDetails.all(),
    },
  },
});
export default Prescriptions;
