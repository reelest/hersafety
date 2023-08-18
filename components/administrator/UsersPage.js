import Admins from "@/models/admin";
import { useQuery } from "@/models/query";
import Registrations from "@/models/registration";
import Students from "@/models/student";
import Teachers from "@/models/teacher";
import { noop } from "@/utils/none";
import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import {
  Box,
  Button,
  IconButton,
  Modal,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { CloseCircle, UserAdd } from "iconsax-react";
import { useEffect, useState } from "react";
import ModelForm from "../ModelForm";
import PageHeader from "../PageHeader";
import {
  TableButton,
  addClassToColumns,
  addHeaderClass,
  supplyValue,
} from "../Table";
import ThemedTable from "../ThemedTable";

import SuccessDialog from "@/components/SuccessDialog";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TABS /*variable*/ = [
  {
    // properties | elements - property of array
    name /* property */: "Admin",
    header: "Admins",
    model: Admins,
    renderHooks: [
      addHeaderClass("whitespace-nowrap"),
      addClassToColumns("min-w-[14rem]", [0]),
      addClassToColumns("whitespace-nowrap", [4]),
      supplyValue((row, col, admins) => {
        const item = admins[row];
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
    ],
  },
  {
    name: "Teacher",
    header: "Teachers",
    model: Teachers,
  },
  {
    name: "Student",
    header: "Students",
    model: Students,
  },
];

export default function UsersPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [selected, setSelected] = useState(-1);
  const [activeTab, setActiveTab] = useState(0);

  const { data: registrations } = useQuery(
    () => TABS[activeTab].model.all(),
    [activeTab],
    {
      watch: true,
    }
  );
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <UsersForm isOpen={formVisible} onClose={() => setFormVisible(false)} />
      <PageHeader title="User Dashboard" />

      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          <Typography variant="h6" as="h2">
            Users
          </Typography>
        </div>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={(e, v) => setActiveTab(v)}
            aria-label="basic tabs example"
          >
            {TABS.map((e, i) => (
              <Tab label={e.header} key={e.name} {...a11yProps(i)} />
            ))}
          </Tabs>
        </Box>
        <div className="flex flex-wrap pt-6 -mx-2 justify-center">
          <Button
            variant="contained"
            size="large"
            onClick={() => setFormVisible(true)}
          >
            Add New {TABS[activeTab].name}{" "}
            <UserAdd size={32} className="ml-2" />
          </Button>
        </div>
        <ThemedTable
          title={TABS[activeTab].header}
          selected={selected}
          setSelected={setSelected}
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
          renderHooks={TABS[activeTab].renderHooks}
          sx={{ width: "100%", flexGrow: 1, mx: 0, mt: 8 }}
        />
      </Box>
    </Box>
  );
}

function UsersForm({ isOpen = false, edit, onClose = noop }) {
  const [item, setItem] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setItem(isOpen ? edit || Registrations.create() : null);
  }, [edit, isOpen]);
  return (
    <Modal onClose={onClose} open={isOpen} className="p-4">
      {/* Modal must have only one child */}
      <Paper className="h-full w-full mx-auto max-w-2xl pt-4 px-8 max-sm:px-4 overflow-auto pb-12">
        <SuccessDialog
          open={submitted}
          onClose={() => {
            setSubmitted(false);
            if (!edit) onClose();
          }}
        />
        <div className="text-right -mx-3.5 max-sm:-mx-0.5">
          <IconButton onClick={onClose}>
            <CloseCircle />
          </IconButton>
        </div>
        <Typography variant="h4" sx={{ mb: 4 }}>
          {edit ? (
            <>Update Student Registration Info</>
          ) : (
            <>Register New Student</>
          )}
        </Typography>
        <ModelForm
          model={Registrations}
          item={item}
          onSubmit={() => setSubmitted(true)}
        />
      </Paper>
    </Modal>
  );
}
