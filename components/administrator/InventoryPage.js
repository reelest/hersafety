import Drugs from "@/models/inventory";
import ModelTable from "../ModelTable";
import { useQuery } from "@/models/lib/query";
import { Card } from "@mui/material";

export default function InventoryPage() {
  /**
   * @type {{data: Drugs[]}}
   */
  const { data: finishedDrugs } = useQuery(
    () => Drugs.withFilter("currentStock", "<", 10).orderBy("currentStock"),
    [],
    { watch: true }
  );
  return (
    <>
      {finishedDrugs && finishedDrugs.length ? (
        <Card
          color="error"
          sx={{
            p: 4,
            my: 4,
            mx: 6,
            backgroundColor: "rgba(255,0,0,0.1)",
            color: "rgba(180,0,20,1)",
            border: "error",
          }}
          elevation={5}
        >
          The following drugs have fallen below minimum stock levels:{" "}
          {finishedDrugs.map((e) => e.name).join(", ")}.
        </Card>
      ) : null}
      <ModelTable Model={Drugs} addActionTitle="Add Drug" />
    </>
  );
}
