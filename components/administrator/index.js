import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  Element3,
  Teacher,
  UserAdd,
  UserEdit,
  WalletMoney,
} from "iconsax-react";
import Overview from "./OverviewPage";
import Transactions from "./TransactionsPage";
import Users from "./UsersPage";
import Events from "./EventsPage";
import Academics from "./AcademicsPage";
import UserRedirect from "../UserRedirect";
import RegistrationsPage from "./RegistrationsPage";
const TABS = [
  {
    name: "Overview",
    icon: Element3,
    component: Overview,
  },
  {
    name: "Transactions",
    icon: WalletMoney,
    component: Transactions,
  },
  {
    name: "Users",
    icon: UserEdit,
    component: Users,
  },
  {
    name: "Academics",
    icon: Teacher,
    component: Academics,
  },
  {
    name: "Registrations",
    icon: UserAdd,
    component: RegistrationsPage,
  },
  {
    name: "News & Events",
    icon: Calendar,
    component: Events,
  },
];
export default function Administrators() {
  return (
    <UserRedirect redirectOnNoUser>
      <DashboardLayout tabs={TABS} />
    </UserRedirect>
  );
}
