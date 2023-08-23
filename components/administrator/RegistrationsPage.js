import { Box, Typography, Button } from "@mui/material";
import PageHeader from "../PageHeader";
import { Add } from "iconsax-react";
import SessionSelect from "../SessionSelect";
import { usePagedQuery, useQuery } from "@/models/query";
import Registrations from "@/models/registration";
import ThemedTable from "../ThemedTable";
import {
  TableButton,
  addClassToColumns,
  addHeaderClass,
  supplyValue,
} from "../Table";
import { useEffect, useState } from "react";
import RegistrationsForm from "./RegistrationsForm";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";

export default function RegistrationsPage() {
  const { data: registrations, pager } = usePagedQuery(
    () => Registrations.all(),
    [],
    {
      watch: true,
    }
  );
  const [formVisible, setFormVisible] = useState(false);
  const [selected, setSelected] = useState(-1);
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <RegistrationsForm
        isOpen={formVisible}
        onClose={() => setFormVisible(false)}
      />
      <PageHeader title="User Dashboard" />
      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          <Typography variant="h6" as="h2">
            Registrations
          </Typography>
        </div>
        <div className="flex flex-wrap pt-6 -mx-2 justify-center">
          <Button
            variant="contained"
            size="large"
            onClick={() => setFormVisible(true)}
          >
            Register New Student <Add size={32} className="ml-2" />
          </Button>
        </div>
        <ThemedTable
          title="Registrations"
          selected={selected}
          setSelected={setSelected}
          pager={pager}
          headerButtons={
            <TableButton
              disabled={selected === -1}
              onClick={async () => {
                if (await confirm("Delete selected item?")) {
                  await registrations[selected].delete();
                  setSelected(-1);
                }
              }}
            >
              Delete
              <TrashIcon className="ml-0.5 relative" width={20} />
            </TableButton>
          }
          headers={[
            "Name",
            "Email",
            "Entrance Class",
            "Gender",
            "DOB",
            "State of Origin",
          ]}
          results={registrations}
          renderHooks={[
            addHeaderClass("whitespace-nowrap"),
            addClassToColumns("min-w-[14rem]", [0]),
            addClassToColumns("whitespace-nowrap", [4]),
            supplyValue((row, col) => {
              const item = registrations[row];
              switch (col) {
                case 0:
                  return item.getName();
                case 1:
                  return item.email;
                case 2:
                  return item.getClass();
                case 3:
                  return item.gender;
                case 4:
                  return item.dateOfBirth;
                case 5:
                  return item.stateOfOrigin;
              }
            }),
          ]}
          sx={{ width: "100%", flexGrow: 1, mx: 0, mt: 8 }}
        />
      </Box>
    </Box>
  );
}
