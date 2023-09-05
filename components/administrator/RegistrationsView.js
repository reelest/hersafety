import { usePagedQuery, useQuery } from "@/models/lib/query";
import { supplyValue } from "../Table";
import ThemedTable from "../ThemedTable";
import Registrations from "@/models/registration";

export default function RegistrationsView() {
  const { data: registrations, pager } = usePagedQuery(() =>
    Registrations.all().pageSize(10)
  );
  return (
    <ThemedTable
      title="Registrations"
      headers={["Name", "Entrance Class", "Gender"]}
      results={registrations}
      pager={pager}
      renderHooks={[
        supplyValue((row, col) => {
          const item = registrations[row];
          switch (col) {
            case 0:
              return item.getName();
            case 1:
              return item.getClass();
            case 2:
              return item.gender;
          }
        }),
      ]}
      sx={{ width: "32rem", flexGrow: 1, maxWidth: "50rem" }}
    />
  );
}
