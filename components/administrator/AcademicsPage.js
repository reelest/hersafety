import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageHeader from "../PageHeader";
import Card2 from "../Card2";

import { ArchiveAdd } from "iconsax-react";
import { useQuery } from "@/models/lib/query";
import Students from "@/models/student";
import Teachers from "@/models/teacher";
import Parents from "@/models/parent";
import SessionSelect from "../SessionSelect";
import { Button, Tab, Tabs } from "@mui/material";
import ModelFormDialog from "../ModelFormDialog";
import { useState } from "react";
import useArrayState from "@/utils/useArrayState";
import Courses from "@/models/course";
import ClassRooms from "@/models/classroom";
import CourseDescriptions from "@/models/course_description";

const useCount = (Model) => {
  return useQuery(() => Model.counter.asQuery(), [], {
    watch: true,
  }).data?.itemCount;
};

const TABS = [
  {
    model: CourseDescriptions,
    header: "Courses",
    name: "course",
  },
  {
    model: ClassRooms,
    header: "Classes",
    name: "class",
  },
  {
    model: Students,
    header: "Students",
    name: "student",
  },
];

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [formVisible, setFormVisible] = useState(false);
  const [edit, setEdit] = useState(null);
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <ModelFormDialog
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
            <ArchiveAdd size={32} className="ml-2" />
          </Button>
        </div>
      </Box>
    </Box>
  );
}
