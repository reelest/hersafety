import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import PageHeader from "../PageHeader";
import Card2, { Card2Wrapper } from "../Card2";

import { ArchiveBox } from "iconsax-react";
import { useQuery } from "@/models/query";
import Students from "../../models/student";
import Teachers from "../../models/teacher";
import Parents from "../../models/parent";
import { Hidden } from "@mui/material";
import Registrations from "@/models/registration";
import PieChart from "../PieChart";
import EventsView from "../EventsView";
import RegistrationsView from "./RegistrationsView";
import PaymentsView from "./PaymentsView";
import SessionSelect from "../SessionSelect";

const useCount = (Model) => {
  return useQuery(() => Model.counter.asQuery(), [], {
    watch: true,
  }).data?.itemCount;
};
export default function OverviewPage() {
  const numStudents = useCount(Students);
  const numTeachers = useCount(Teachers);
  const numParents = useCount(Parents);
  const numRegistrations = useCount(Registrations);
  const completeProfiles =
    (100 *
      (useQuery(() => Teachers.counter.asQuery(), []).data?.completedProfiles ??
        0)) /
    (numTeachers || 1);
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <PageHeader title="User Dashboard" />
      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          <Typography variant="h6" as="h2">
            Overview
          </Typography>
          <SessionSelect />
        </div>
        <div className="flex flex-wrap pt-6 -mx-2">
          <Card2
            icon={ArchiveBox}
            label="Total number of students"
            value={numStudents}
          />
          <Card2
            icon={ArchiveBox}
            label="Total number of parents"
            value={numParents}
          />
          <Card2
            icon={ArchiveBox}
            label="Total number of teachers"
            value={numTeachers}
          />
          <Card2
            icon={ArchiveBox}
            label="Total number of new registrations"
            value={numRegistrations}
          />
        </div>
        <div className="flex flex-wrap pt-6 -mx-2 max-sm:justify-center">
          <Card2Wrapper
            color="white"
            className=" px-4 py-4 items-center flex-grow"
            sx={{
              border: "1px solid rgba(0,0,0,0.05)",
              maxWidth: { xs: "14.75rem", sm: "25rem" },
            }}
          >
            <div className="flex-col flex">
              <Typography
                variant="body2"
                sx={{ mb: 4 }}
                className="text-center"
              >
                Completed Teacher Profiles
              </Typography>

              <Hidden smUp>
                <PieChart percent={completeProfiles} className="m-4" />
              </Hidden>
              <Typography variant="body2" className="text-center">
                {completeProfiles}%
              </Typography>
            </div>
            <Hidden smDown>
              <PieChart percent={completeProfiles} className="mx-4" />
            </Hidden>
          </Card2Wrapper>
          <EventsView />
          <RegistrationsView />
          <PaymentsView />
        </div>
      </Box>
    </Box>
  );
}
