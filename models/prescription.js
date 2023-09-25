import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import Clients from "./client";
import Drugs from "./inventory";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { noop } from "@/utils/none";
import { DeleteItemAction, SetIDAction, trackRefs } from "./lib/trackRefs";

class DrugDetail extends CountedItem {
  prescriptionId = "";
  drug = "";
  amount = 0;
  static {
    trackRefs(this, ["drug", "prescriptionId"]);
  }
}
const DrugDetails = new CountedModel("drug_details", DrugDetail, {
  prescriptionId: {
    type: "ref",
    refModel: Clients,
    hidden: true,
  },
  drug: {
    type: "ref",
    refModel: Drugs,
    pickRefQuery: Drugs.all(),
  },
  async [MODEL_ITEM_PREVIEW](item) {
    const drug = await Drugs.item(item.drug).load();
    return {
      title: `${drug.name}(${item.amount})`,
    };
  },
});

class Prescription extends CountedItem {
  user = "";
  date = new Date();
  drugs = [];
  static {
    trackRefs(
      this,
      ["drugs"],
      [new SetIDAction("prescriptionId")],
      [new DeleteItemAction()]
    );
  }
}

const Prescriptions = new CountedModel("prescriptions", Prescription, {
  user: {
    type: "ref",
    refModel: Clients,
    pickRefQuery: Clients.all(),
    hidden: true,
  },
  drugs: {
    type: "array",
    label: "Drugs Prescribed",
    arrayType: {
      type: "ref",
      refModel: DrugDetails,
    },
  },
});

export default Prescriptions;
