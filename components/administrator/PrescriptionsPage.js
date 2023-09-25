import { useState } from "react";
import ModelTable from "../ModelTable";
import Prescriptions from "@/models/prescription";
import ModelFormRefField from "../ModelFormRefField";
import ModelForm from "../ModelForm";

export default function PrescriptionsPage() {
  const [activeUser, setActiveUser] = useState(null);
  const clientId = activeUser;
  return (
    <div>
      <ModelForm
        initialValue={{ user: activeUser }}
        onChange={({ user }) => {
          console.log({ user });
          setActiveUser(user);
        }}
        meta={{ user: Prescriptions.Meta.user }}
        className="p-4 flex justify-end"
      >
        <ModelFormRefField
          name="user"
          meta={Prescriptions.Meta.user}
          sx={{ minWidth: "10rem" }}
        />
      </ModelForm>
      <ModelTable
        Model={Prescriptions}
        props={["date", "drugs"]}
        onCreate={() => {
          if (!clientId) return false;
          const item = Prescriptions.create();
          item.user = clientId;
          return item;
        }}
        deps={[clientId]}
        Query={clientId && Prescriptions.withFilter("user", "==", clientId)}
      />
    </div>
  );
}
