import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import Clients from "./client";
import Drugs from "./inventory";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { noop } from "@/utils/none";
import { DeleteItemAction, SetIDAction, trackRefs } from "./lib/trackRefs";
import { SKIP_PICKER } from "@/components/ModelFormRefField";
import Payments from "./payment";

class DrugDetail extends CountedItem {
  prescriptionId = "";
  drug = "";
  amount = 0;
  async getPrice(txn) {
    await this.load();
    return (await Drugs.item(this.drug).read(txn)).price * this.amount;
  }
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
  paid = "";
  async getPrice(txn) {
    await this.load();
    return (
      await Promise.all(
        this.drugs.map(async (e) => {
          return await DrugDetails.item(e).getPrice(txn);
        })
      )
    ).reduce((e, i) => e + i, 0);
  }
  async acceptPayment(txn) {
    return this.atomicUpdate(
      async (txn, doc) => {
        if (doc.paid) return false;
        const payment = Payments.create();
        await payment.set({ amount: await this.getPrice(txn) }, txn);
        await this.set({ paid: payment.id() });
      },
      true,
      txn
    );
  }
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
      [SKIP_PICKER]: true,
    },
  },
  paid: {
    type: "ref",
    hidden: true,
    refModel: Payments,
    pickRefQuery: Payments.all(),
  },
});

export default Prescriptions;
