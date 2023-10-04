import { useState } from "react";
import ModelTable from "../ModelTable";
import Prescriptions, { Prescription } from "@/models/prescription";
import ModelFormRefField from "../ModelFormRefField";
import ModelForm from "../ModelForm";
import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import useQueryState from "@/utils/useQueryState";
import { supplyValue } from "../Table";
import useUserData from "@/logic/user_data";

export default function PrescriptionsPage() {
  const [activeUser, setActiveUser] = useQueryState("user", null);
  const [modalOpen, showReceipt] = useState(null);
  const clientId = activeUser;
  const userRole = useUserData()?.getRole?.();
  return (
    <div>
      <Box
        sx={{ height: clientId ? 0 : "15vh", transition: "height 0.6s" }}
      ></Box>
      <ModelForm
        initialValue={{ user: activeUser }}
        onChange={({ user }) => {
          setActiveUser(user);
        }}
        meta={{ user: Prescriptions.Meta.user }}
        className="p-4 flex justify-center"
      >
        <ModelFormRefField
          name="user"
          label="Select Client"
          meta={Prescriptions.Meta.user}
          sx={{ minWidth: "20rem" }}
        />
      </ModelForm>
      <Modal
        open={!!modalOpen}
        onClose={() => showReceipt(null)}
        className="flex justify-center items-center"
      >
        <Paper className="max-w-xl pt-4 px-8 max-sm:px-4 pb-4"></Paper>
      </Modal>{" "}
      {clientId ? (
        <ModelTable
          Model={Prescriptions}
          props={["date", "drugs", "price", ""]}
          enablePrint
          onClickRow={(prescription) => showReceipt(prescription)}
          onCreate={() => {
            if (!clientId) return false;
            const item = Prescriptions.create();
            item.user = clientId;
            return item;
          }}
          deps={[clientId]}
          renderHooks={[
            supplyValue((row, col, prescriptions) => {
              if (col === 3) {
                /** @type {Prescription} */
                const data = prescriptions[row];
                if (data?.paid) {
                  return "Paid";
                } else {
                  return userRole === "admin" ? (
                    <Button
                      onClick={async () => {
                        await data.acceptPayment();
                      }}
                    >
                      Verify Payment
                    </Button>
                  ) : (
                    "Awaiting payment"
                  );
                }
              }
              return prescriptions;
            }),
          ]}
          Query={clientId && Prescriptions.withFilter("user", "==", clientId)}
        />
      ) : (
        <div className="flex justify-center items-center min-h-[50vh] p-6">
          <Typography
            color="text.disabled"
            sx={{ fontSize: "1.5rem", opacity: 0.5 }}
          >
            View and modify client prescriptions.
          </Typography>
        </div>
      )}
    </div>
  );
}
