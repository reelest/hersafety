import Drugs from "@/models/inventory";
import ModelTable from "../ModelTable";
import { Box } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import { UserEdit, Airdrop } from "iconsax-react";
import UsersPage from "./UsersPage";

const TABS = [
  {
    name: "Users",
    icon: UserEdit,
    component: UsersPage,
  },
  {
    name: "Inventory",
    icon: Airdrop,
    component: InventoryPage,
  },
];
export default function Admin() {
  return <DashboardLayout tabs={TABS} />;
}
