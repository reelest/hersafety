import ModelTable from "../ModelTable";
import Prescriptions from "@/models/prescription";

export default function PrescriptionsView({ clientId }) {
  return (
    <ModelTable
      Model={Prescriptions}
      onCreate={() => {
        const item = Prescriptions.create();
        item.user = clientId;
        return item;
      }}
      Query={Prescriptions.withFilter("user", "==", clientId)}
    />
  );
}
