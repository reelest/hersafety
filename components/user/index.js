import DashboardLayout from "../DashboardLayout";
import { UserEdit, Airdrop, User, Personalcard } from "iconsax-react";
import PageHeader from "../PageHeader";
import UserRedirect from "../UserRedirect";
import Head from "next/head";
import DashboardPage from "./DashboardPage";
import ContactsPage from "./ContactsPage";

const TABS = [
  {
    name: "Dashboard",
    icon: UserEdit,
    component: DashboardPage,
  },
  {
    name: "My Contacts",
    icon: User,
    component: ContactsPage,
  },
  {
    name: "My Info",
    icon: Personalcard,
    // component: NotificationsPage,
  },
  {
    name: "Nearby Stations",
    icon: Personalcard,
    // component: NotificationsPage,
  },
  {
    name: "Notifications",
    icon: Personalcard,
    // component: NotificationsPage,
  },
];

export default function UserDashboard() {
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
              <tab.component />
            </>
          );
        }}
      />
    </UserRedirect>
  );
}
