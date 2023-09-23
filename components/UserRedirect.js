import { useUser } from "@/logic/api";
import { useRouter } from "next/router";
import isServerSide from "@/utils/is_server_side";
import FullscreenLoader from "./FullscreenLoader";

const DASHBOARD_URL = {
  administrator: "/admin",
  student: "/student",
  parent: "/parent",
  teacher: "/teacher",
};

export default function UserRedirect({
  redirectOnUser,
  redirectOnNoUser,
  children,
}) {
  const user = useUser();
  const router = useRouter();
  if (user === undefined) {
    return <FullscreenLoader />;
  } else if (user === null) {
    if (redirectOnNoUser) {
      if (!isServerSide) router.replace("/login");
      return null;
    }
  } else if (redirectOnUser) {
    if (!isServerSide) router.replace(DASHBOARD_URL[user.role]);
    return null;
  }
  return children;
}
