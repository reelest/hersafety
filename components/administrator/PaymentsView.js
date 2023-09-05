import { usePagedQuery, useQuery } from "@/models/lib/query";
import ThemedTable from "../ThemedTable";
import Payments from "@/models/payment";
import { supplyValue } from "../Table";
import { formatDate, formatTime } from "@/utils/formatNumber";

export default function PaymentsView() {
  const { data: payments, pager } = usePagedQuery(() =>
    Payments.all().pageSize(10)
  );
  return (
    <ThemedTable
      title="Payments"
      headers={["Name", "Description", "Amount", "Date", "Time"]}
      sx={{ width: "50rem", flexGrow: 1, maxWidth: "100%" }}
      results={payments}
      pager={pager}
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
              return formatDate(item.timestamp);
            case 4:
              return formatTime(item.timestamp);
          }
        }),
      ]}
    />
  );
}
