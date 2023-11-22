import Notifications from "@/models/notification";
import ModelTable from "../ModelTable";

export default function NotificationsPage() {
  /**
   * @type {{data: Drugs[]}}
   */
  return (
    <>
      <ModelTable Model={Notifications} addActionTitle="New Notification" />
    </>
  );
}
