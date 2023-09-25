import Clients from "@/models/client";
import { useState } from "react";
import { Modal, Paper } from "@mui/material";
import Form, { FormField, FormSubmit } from "../Form";
import ModelTable from "../ModelTable";
import { createUser } from "@/logic/admin";

export default function UsersPage() {
  const [formCreationRequest, setFormCreationRequest] = useState(null);
  const _return = (value) => {
    setFormCreationRequest((e) => {
      e?.(value);
      return null;
    });
  };
  return (
    <>
      <Modal
        open={!!formCreationRequest}
        onClose={() => _return(false)}
        className="flex justify-center items-center"
      >
        <Paper className="max-w-xl pt-4 px-8 max-sm:px-4 pb-4">
          <Form
            initialValue={{ name: "" }}
            onSubmit={async (data) => {
              const DEFAULT_PASSWORD = "student987";
              let s = await createUser(data, DEFAULT_PASSWORD);
              let m = await Clients.getOrCreate(s, async (item, txn) => {
                if (item.isLocalOnly())
                  await item.set({ name: data.name }, txn);
              });
              _return(m);
            }}
          >
            <FormField name="email" label="Client email" />
            <FormSubmit
              variant="contained"
              sx={{ mt: 5, mx: "auto", display: "block" }}
            >
              Done
            </FormSubmit>
          </Form>
        </Paper>
      </Modal>
      <ModelTable
        Model={Clients}
        onCreate={() => {
          return new Promise((r, j) => {
            setFormCreationRequest(() => r);
          });
        }}
      />
    </>
  );
}
