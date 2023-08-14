import { useQuery } from "@/models/table";
import ThemedTable from "../ThemedTable";
import Payments from "@/models/payment";
import { supplyValue } from "../Table";

export default function PaymentsView() {
  const { data: payments } = useQuery(() => Payments.all());
  return (
    <ThemedTable
      title="Payments"
      headers={["Name", "Description", "Amount", "Date", "Time"]}
      sx={{ width: "50rem", flexGrow: 1, maxWidth: "100%" }}
      results={payments}
      renderHooks={[
        supplyValue((row, col) => {
          const item = payments[row];
          switch (col) {
            case 0:
              return item.name;
            case 1:
              return item.description;
            case 2:
              return item.amount;
            case 3:
              return item.getDate();
            case 4:
              return item.getTime();
          }
        }),
      ]}
    />
  );
}
