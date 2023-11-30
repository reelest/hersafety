import useUserData from "@/logic/user_data";
import getContacts from "@/models/contact";
import { useQuery } from "@/models/lib/query";
import ModelFormDialog from "../ModelFormDialog";
import { useState } from "react";
import { Button, Card, List, ListItem, Paper, Typography } from "@mui/material";
import { Add, InfoCircle } from "iconsax-react";
import uniqueKey from "@/utils/uniqueKey";

export default function ContactsPage() {
  const user = useUserData();
  const Contacts = user && getContacts(user);
  const { count, data, loading } = useQuery(() => Contacts?.all(), [user]);
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ModelFormDialog
        isOpen={isOpen}
        model={Contacts}
        closeOnSubmit
        onclose={() => setOpen(false)}
      />
      <Button variant="contained" onClick={() => setOpen(true)}>
        Add Contact <Add />
      </Button>
      {data ? (
        data.length === 0 ? (
          <div className="flex flex-col items-center p-10">
            <InfoCircle size={32} className="text-primary mb-4" />
            <Typography elevation={1}>No Contacts Yet</Typography>
          </div>
        ) : (
          <List>
            {data.map((e) => (
              <ListItem key={uniqueKey(e)}>{e}</ListItem>
            ))}
          </List>
        )
      ) : null}
    </>
  );
}
