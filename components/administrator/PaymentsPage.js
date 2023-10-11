import Payments from "@/models/payment";
import ModelTable from "../ModelTable";

export default function PaymentsPage() {
  return (
    <ModelTable
      Model={Payments}
      Query={Payments.all().orderBy("date")}
      allowEdit={false}
      allowCreate={false}
      allowDelete={false}
    />
  );
}
