import DashboardLayout from "@/components/DashboardLayout";
import { Element3 } from "iconsax-react";
import UserRedirect from "../UserRedirect";
import PageHeader from "../PageHeader";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Head from "next/head";
import ModelForm from "../ModelForm";
import ActivationRequests from "@/models/activation_requests";
import { useRef, useState } from "react";
import { useUser } from "@/logic/auth";
import { useQuery } from "@/models/lib/query";
import { UserRoles } from "@/models/user";
const TABS = [
  {
    name: "Request Verification",
    icon: Element3,
    component: RequestActivation,
  },
];

function RequestActivation() {
  const item = useRef(ActivationRequests.create());
  const user = useUser();
  const [sent, setSent] = useState(false);
  const activationRequests = useQuery(
    () => user && ActivationRequests.withFilter("uid", "==", user.uid),
    [user],
    { watch: false }
  )?.data?.length;
  const { loading, data: activated } = useQuery(
    () => user && UserRoles.item(user.uid).asQuery(),
    [user],
    { watch: true }
  );
  return (
    <Box sx={{ backgroundColor: "background.default", minHeight: "100vh" }}>
      <PageHeader title="User Dashboard" />
      <Box className="px-4 sm:px-8 py-8">
        <div className="flex flex-wrap justify-between">
          <Typography variant="h6" as="h2">
            Request Activation
          </Typography>
        </div>
        <Box
          sx={{
            marginTop: 16,
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h1">
            Oops, we do not yet know who you are.
          </Typography>
          <Typography variant="body1" sx={{ my: 10 }}>
            Please, contact the system administrator to assign you a role.
          </Typography>
          {activationRequests === undefined || loading ? (
            <CircularProgress />
          ) : activated ? (
            <>
              <Typography variant="button">
                Your account has been activated.
              </Typography>
              <div className="flex my-2">
                <Button variant="contained" href="/">
                  Go to Dashboard
                </Button>
              </div>
            </>
          ) : activationRequests === 0 && !sent ? (
            <ModelForm
              item={item.current}
              model={ActivationRequests}
              onSubmit={() => setSent(true)}
              submitText={"Request Activation"}
            />
          ) : (
            <Typography variant="button">Awaiting Activation</Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function Guest() {
  return (
    <>
      <Head>
        <title>CSMS Request Activation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="CSMS Administrator Dashboard" />
      </Head>
      <UserRedirect redirectOnNoUser>
        <DashboardLayout tabs={TABS} />
      </UserRedirect>
    </>
  );
}
