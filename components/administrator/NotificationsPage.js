import Notifications from "@/models/notification";
import ModelTable from "../ModelTable";
import { Card } from "@mui/material";

export default function InventoryPage() {
  /**
   * @type {{data: Drugs[]}}
   */
  const { data: unreadNotifications } = {};
  return (
    <>
      {unreadNotifications && unreadNotifications.length ? (
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
          {unreadNotifications}.
        </Card>
      ) : null}
      <ModelTable Model={Notifications} addActionTitle="New Notification" />
    </>
  );
}
