import useUserData from "@/logic/user_data";
import getContacts from "@/models/contact";
import { useQuery } from "@/models/lib/query";
import ModelFormDialog from "../ModelFormDialog";
import { useState } from "react";
import { Button } from "@mui/material";
import { Add } from "iconsax-react";

export default function ContactsPage() {
  const user = useUserData();
  const Contacts = user && getContacts(user);
  const { count, data, loading } = useQuery(() => Contacts?.all());
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ModelFormDialog isOpen={isOpen} model={Contacts} />
      <Button variant="contained" onClick={() => setOpen(true)}>
        <Add />
      </Button>
      {data ? (data.length ? data.map((e) => e.name) : null) : null}
    </>
  );
}
