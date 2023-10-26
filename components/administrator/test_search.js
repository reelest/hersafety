import { CountedItem } from "@/models/lib/counted_item";
import ModelTable from "../ModelTable";
import { indexForSearch } from "@/models/lib/indexForSearch";
import { Model } from "@/models/lib/model";

const SearchTest = new Model(
  "search_test",
  class extends CountedItem {
    name = "";
    nickname = "";
    static {
      indexForSearch(this, ["name", "nickname"]);
    }
  }
);

export default function SearchTestView() {
  return <ModelTable Model={SearchTest} />;
}
