import Drugs from "@/models/inventory";
import ModelTable from "../ModelTable";
import { Box } from "@mui/material";
import DashboardLayout from "../DashboardLayout";
import { UserEdit, Airdrop } from "iconsax-react";
import PageHeader from "../PageHeader";
import UserRedirect from "../UserRedirect";
import Head from "next/head";
import Prescriptions from "@/models/prescription";
import { useUser } from "@/logic/auth";

export default function Client() {
  const clientId = useUser()?.uid;
  return (
    <UserRedirect redirectOnNoUser>
      <Head>
        <title>MOUOA - Client Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Reset password to MOUOA Dashboard" />
      </Head>
      <ModelTable
        Model={Prescriptions}
        props={["date", "drugs"]}
        enablePrint
        deps={[clientId]}
        Query={clientId && Prescriptions.withFilter("user", "==", clientId)}
      />
    </UserRedirect>
  );
}
