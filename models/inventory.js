import { CountedItem } from "./lib/counted_item";
import { CountedModel } from "./lib/counted_model";
import { Item } from "./lib/model";

class Drug extends CountedItem {
  name = "";
  price = 0;
  currentStock = 0;
}

const Drugs = new CountedModel("drugs", Drug);
export default Drugs;
