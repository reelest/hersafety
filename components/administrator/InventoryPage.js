import Drugs from "@/models/inventory";
import ModelTable from "../ModelTable";

export default function InventoryPage() {
  return <ModelTable Model={Drugs} />;
}
