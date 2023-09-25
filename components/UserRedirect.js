import { useRouter } from "next/router";
import isServerSide from "@/utils/is_server_side";
import FullscreenLoader from "./FullscreenLoader";
import useUserData from "@/logic/user_data";

const DASHBOARD_URL = {
  admin: "/admin",
  student: "/admin",
  parent: "/parent",
  teacher: "/admin",
  guest: "/guest",
};

export default function UserRedirect({
  redirectOnUser,
  redirectOnNoUser,
  children,
}) {
  const userData = useUserData();
  const router = useRouter();
  if (userData === undefined) {
    return <FullscreenLoader />;
  } else if (userData === null) {
    if (redirectOnNoUser) {
      if (!isServerSide) router.replace("/login");
      return <FullscreenLoader />;
    }
  } else if (redirectOnUser) {
    if (!isServerSide) router.replace(DASHBOARD_URL[userData.getRole()]);
    return <FullscreenLoader />;
  }
  return children;
}
