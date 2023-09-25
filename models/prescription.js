import Clients from "./client";
import Drugs from "./inventory";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";

class DrugDetail extends CountedItem {
  prescriptionId = "";
  drug = "";
  date = new Date();
  amount = 0;
}
const DrugDetails = new CountedModel("drug_details", DrugDetail, {
  prescriptionId: {
    type: "ref",
    refModel: Clients,
    hidden: true,
  },
});

class Prescription extends CountedItem {
  user = "";
  drugs = [];
}

const Prescriptions = new CountedModel("prescriptions", Prescription, {
  user: {
    type: "ref",
    refModel: Clients,
    hidden: true,
  },
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
