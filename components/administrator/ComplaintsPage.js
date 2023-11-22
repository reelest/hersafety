import Complaints from "@/models/complaint";
import ModelTable from "../ModelTable";
import { Card } from "@mui/material";

export default function ComplaintsPage() {
  /**
   * @type {{data: Drugs[]}}
   */
  return (
    <>
      <ModelTable Model={Complaints} addActionTitle="New Complaint" />
    </>
  );
}
