import ModelTable from "../ModelTable";
import { Box } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import { UserEdit, Airdrop } from "iconsax-react";
import PageHeader from "../PageHeader";
import UserRedirect from "../UserRedirect";
import Head from "next/head";
import { useUser } from "@/logic/auth";

const TABS = [
  {
    name: "Users",
    icon: UserEdit,
    // component: UsersPage,
  },
  {
    name: "Complaints",
    icon: Airdrop,
    // component: ComplaintsPage,
  },
  {
    name: "Notifications",
    icon: Airdrop,
    // component: NotificationsPage,
  },
];

export default function UserDashboard() {
  const clientId = useUser()?.uid;
  return (
    <UserRedirect redirectOnNoUser>
      <Head>
        <title>Guardian - User Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Reset password to Guardian Dashboard"
        />
      </Head>
      <DashboardLayout
        tabs={TABS}
        renderChild={(tab) => {
          return (
            <>
              <PageHeader title="Client Dashboard" />
              {/* <tab.component /> */}
            </>
          );
        }}
      />
    </UserRedirect>
  );
}
