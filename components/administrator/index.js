import Drugs from "@/models/inventory";
import ModelTable from "../ModelTable";
import { Box } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import { UserEdit, Airdrop, Wallet } from "iconsax-react";
import UsersPage from "./UsersPage";
import ComplaintsPage from "./ComplaintsPage";
import PageHeader from "../PageHeader";
import UserRedirect from "../UserRedirect";
import Head from "next/head";
import NotificationsPage from "./NotificationsPage";

const TABS = [
  {
    name: "Users",
    icon: UserEdit,
    component: UsersPage,
  },
  {
    name: "Complaints",
    icon: Airdrop,
    component: ComplaintsPage,
  },
  {
    name: "Notifications",
    icon: Airdrop,
    component: NotificationsPage,
  },
];
export default function Admin() {
  return (
    <UserRedirect redirectOnNoUser>
      <Head>
        <title>MOUOA - Admin Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Reset password to MOUOA Dashboard" />
      </Head>

      <DashboardLayout
        tabs={TABS}
        renderChild={(tab) => {
          return (
            <>
              <PageHeader />
              <tab.component />
            </>
          );
        }}
      />
    </UserRedirect>
  );
}
