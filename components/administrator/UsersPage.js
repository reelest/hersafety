import Admins from "@/models/admin";
import { usePagedQuery, useQuery } from "@/models/lib/query";
import Registrations from "@/models/registration";
import Students from "@/models/student";
import Teachers from "@/models/teacher";
import { noop } from "@/utils/none";
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
import { Edit as EditIcon, Trash as TrashIcon, UserAdd } from "iconsax-react";
import { useEffect, useState } from "react";
import PageHeader from "../PageHeader";
import {
  TableButton,
  addClassToColumns,
  addHeaderClass,
  supplyValue,
} from "../Table";
import ThemedTable from "../ThemedTable";

import ActivationRequests from "@/models/activation_requests";
import { activateUser, createUser } from "@/logic/admin";
import ModelFormDialog from "../ModelFormDialog";
import ModelDataView, { supplyModelValues } from "../ModelDataView";
import { DatabaseError } from "@/models/lib/errors";

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
    headers: [
      "Name",
      "Email",
      "Phone Number",
      "Last Login",
      "Profile Completed",
    ],
    renderHooks: [
      addHeaderClass("whitespace-nowrap"),
      addClassToColumns("min-w-[14rem]", [0]),
      supplyModelValues([
        "name",
        "email",
        "phoneNumber",
        "lastLogin",
        "profileCompleted",
      ]),
    ],
  },
  {
    name: "Teacher",
    header: "Teachers",
    model: Teachers,
    headers: [
      "Name",
      "Email",
      "Phone Number",
      "Last Login",
      "Profile Completed",
    ],
    renderHooks: [
      addHeaderClass("whitespace-nowrap"),
      addClassToColumns("min-w-[14rem]", [0]),
      addClassToColumns("whitespace-nowrap", [3]),
      supplyModelValues([
        "name",
        "email",
        "phoneNumber",
        "lastLogin",
        "profileCompleted",
      ]),
    ],
  },
  {
    name: "Student",
    header: "Students",
    model: Students,
    headers: [
      "Name",
      "Email",
      "Phone Number",
      "Last Login",
      "Profile Completed",
    ],
    renderHooks: [
      addHeaderClass("whitespace-nowrap"),
      addClassToColumns("min-w-[14rem]", [0]),
      addClassToColumns("whitespace-nowrap", [3]),
      supplyModelValues([
        "name",
        "email",
        "phoneNumber",
        "lastLogin",
        "profileCompleted",
      ]),
    ],
  },
];

export default function UsersPage() {
  const [formVisible, setFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [edit, setEdit] = useState(null);
  useEffect(() => {
    if (!formVisible) {
      setEdit(null);
    }
  }, [formVisible]);
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <UsersForm
        isOpen={formVisible}
        edit={edit}
        onClose={() => setFormVisible(false)}
        model={TABS[activeTab].model}
      />
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
        <UsersTable
          activeTab={activeTab}
          edit={(item) => {
            setEdit(item);
            setFormVisible(true);
          }}
        />
      </Box>
      <ActivationRequestsTable />
    </Box>
  );
}

function UsersTable({ edit, activeTab }) {
  const [selected, setSelected] = useState(-1);
  const { data: users, loading } = useQuery(
    () => TABS[activeTab].model.all().pageSize(10),
    [activeTab],
    {
      watch: true,
    }
  );
  return (
    <ThemedTable
      title={TABS[activeTab].header}
      selected={selected}
      setSelected={setSelected}
      headerButtons={
        <div>
          <TableButton
            color="primary"
            disabled={selected === -1}
            onClick={async () => {
              edit(users[selected]);
            }}
          >
            <EditIcon className="mr-1 relative" width={20} />
            Edit
          </TableButton>
          <TableButton
            color="error"
            disabled={selected === -1}
            onClick={async () => {
              if (await confirm("Delete selected item?")) {
                await users[selected].delete();
                setSelected(-1);
              }
            }}
          >
            <TrashIcon className="mr-0.5 relative" width={20} />
            Delete
          </TableButton>
        </div>
      }
      headers={TABS[activeTab].headers}
      results={loading ? null : users}
      renderHooks={TABS[activeTab].renderHooks}
      sx={{ width: "100%", flexGrow: 1, mx: 0, mt: 8 }}
    />
  );
}

function UsersForm({ edit, model: UserModel, ...props }) {
  return (
    <ModelFormDialog
      edit={edit}
      title={
        edit ? <>Update Student Registration Info</> : <>Register New Student</>
      }
      model={UserModel}
      noSave={!edit}
      onSubmit={async (data) => {
        if (!edit) {
          const DEFAULT_PASSWORD = "student987";
          const uid = await createUser(data.email, DEFAULT_PASSWORD);
          const success = await UserModel.getOrCreate(
            uid,
            async (user, txn) => {
              if (!user.isLocalOnly()) {
                return false;
              } else {
                console.log(user);
                user.setData(data);
                await user.save(txn);
                return true;
              }
            }
          );
          if (!success)
            throw new DatabaseError(
              "User already exists with provided email address"
            );
        }
      }}
      {...props}
    />
  );
}

function ActivationRequestsTable() {
  const { loading, data: users } = usePagedQuery(
    () => ActivationRequests.all(),
    [],
    { watch: true }
  );

  return (
    <Box className="px-4 sm:px-8 py-8">
      <ThemedTable
        title={"Activation Requests"}
        headers={["Name", "Email", "Role", "", ""]}
        results={loading ? null : users}
        renderHooks={[
          addClassToColumns("w-0", [3, 4]),
          supplyValue((row, col, data) => {
            const item = /** @type {ActivationRequest}*/ (data[row]);
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return item.role;
              case 3:
                return (
                  <Button onClick={() => activateUser(item)}>Activate</Button>
                );
              case 4:
                return (
                  <Button color="error" onClick={() => item.delete()}>
                    Delete
                  </Button>
                );
            }
          }),
        ]}
        data={loading ? null : users}
        sx={{ width: "100%", flexGrow: 1, mx: 0, mt: 8 }}
      />
    </Box>
  );
}
