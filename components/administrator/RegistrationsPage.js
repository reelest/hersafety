import { Box, Typography, Button } from "@mui/material";
import PageHeader from "../PageHeader";
import { Add } from "iconsax-react";
import SessionSelect from "../SessionSelect";
import { useQuery } from "@/models/model";
import Registrations from "@/models/registration";
import ThemedTable from "../ThemedTable";
import { addHeaderClass, supplyValue } from "../Table";
import { useState } from "react";
import RegistrationsForm from "./RegistrationsForm";

export default function RegistrationsPage() {
  const { data: registrations } = useQuery(() => Registrations.all());
  const [formVisible, setFormVisible] = useState(false);
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
          <SessionSelect />
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
            supplyValue((row, col) => {
              const item = registrations[row];
              switch (col) {
                case 0:
                  return item.getName();
                case 1:
                  return item.email;
                case 2:
                  return item.entranceClass;
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
