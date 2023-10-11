import { MODEL_ITEM_PREVIEW } from "@/components/ModelItemPreview";
import Clients from "./client";
import Drugs from "./inventory";
import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { noop } from "@/utils/none";
import { SKIP_PICKER } from "@/components/ModelFormRefField";
import Payments from "./payment";
import UpdateValue from "./lib/update_value";
import { HiddenField } from "./lib/model_types";

class DrugDetail extends CountedItem {
  prescriptionId = "";
  drug = "";
  amount = 0;
  paidUnitPrice = -1;
  async getPrice(txn) {
    if (!this._isLoaded) await this.load();
    return (await this.getUnitPrice(txn)) * this.amount;
  }
  async getUnitPrice(txn) {
    if (!this._isLoaded) await this.load();
    if (this.paidUnitPrice >= 0) return this.paidUnitPrice;
    return (await Drugs.preview(this.drug, txn)).price;
  }
  async onPurchase(txn) {
    await this.set({ paidUnitPrice: await this.getUnitPrice() }, txn);
    await Drugs.item(this.drug).set({
      currentStock: UpdateValue.add(-this.amount),
    });
  }
  async getInStock(txn) {
    if (!this._isLoaded) await this.load();
    return (await Drugs.preview(this.drug, txn)).currentStock >= this.amount;
  }
}
export const DrugDetails = new CountedModel("drug_details", DrugDetail, {
  prescriptionId: {
    type: "ref",
    refModel: null,
    hidden: true,
  },
  drug: {
    type: "ref",
    refModel: Drugs,
    pickRefQuery: Drugs.all(),
  },
  paidUnitPrice: HiddenField,
  async [MODEL_ITEM_PREVIEW](item) {
    const drug = await Drugs.preview(item.drug);
    return {
      title: `${drug.name} (${item.amount} pcs)`,
    };
  },
});
DrugDetails.hasOneOrMore(Drugs);
export class Prescription extends CountedItem {
  user = "";
  date = new Date();
  drugs = [];
  paid = "";
  async getPrice(txn) {
    if (!this._isLoaded) await this.load();
    if (this.paid) return (await Payments.preview(this.paid)).amount;
    return (
      await Promise.all(
        this.drugs.map(async (e) => {
          return await DrugDetails.item(e).getPrice(txn);
        })
      )
    ).reduce((e, i) => e + i, 0);
  }
  async getStatus() {
    if (!this._isLoaded) await this.load();
    if (this.paid) {
      return "Paid";
    } else {
      return "Awaiting payment";
    }
  }
  async getTimeOfPayment() {
    if (!this._isLoaded) await this.load();
    if (this.paid) {
      return (await Payments.preview(this.paid)).date;
    } else {
      return "NIL";
    }
  }
  async getPaymentMethod() {
    if (!this._isLoaded) await this.load();
    if (this.paid) {
      return (await Payments.preview(this.paid)).method;
    } else {
      return "NIL";
    }
  }
  async acceptPayment(adminUid, price, method = "manual", txn) {
    const _current = await this.getPrice(txn);
    if (price === undefined) {
      price = _current;
    } else if (price !== _current) {
      throw new Error("Pament price does not match listed price.");
    }
    return this.atomicUpdate(
      async (txn, doc) => {
        if (doc.paid) return false;
        const payment = Payments.create();
        await payment.set(
          { amount: await this.getPrice(txn), authorizedBy: adminUid, method },
          txn
        );
        this.drugs.map(async (e) => {
          return await DrugDetails.item(e).onPurchase(txn);
        });
        await this.set({ paid: payment.id() }, txn);
      },
      true,
      txn
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
Prescriptions.hasOneOrMore(DrugDetails, "prescriptionId", {
  field: "drugs",
  deleteOnRemove: true,
});
Prescriptions.hasOneOrMore(Clients, null, { field: "user" });
Prescriptions.hasOneOrMore(Payments, null, { field: "paid" });

export default Prescriptions;
