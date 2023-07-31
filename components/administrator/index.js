import DashboardLayout from "@/components/DashboardLayout";
import {
  Calendar,
  Element3,
  Money,
  RowVertical,
  Teacher,
  UserEdit,
  WalletMoney,
} from "iconsax-react";
import Overview from "./Overview";
import Transactions from "./Transactions";
import Users from "./Users";
import Events from "./Events";
import Academics from "./Academics";
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
    name: "Events",
    icon: Calendar,
    component: Events,
  },
];
export default function Administrators() {
  return <DashboardLayout tabs={TABS} />;
}
