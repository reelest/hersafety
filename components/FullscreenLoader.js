import { useTheme } from "@mui/material";
import LoaderAnimation from "./LoaderAnimation";

export default function FullscreenLoader() {
  const theme = useTheme();
  return (
    <div
      style={{ color: theme.palette.primary.light }}
      className="fixed font-24b flex-col bg-black bg-opacity-10 inset-0 h-screen flex justify-center items-center"
    >
      <LoaderAnimation className="w-12 my-10" />
      &nbsp;Please wait...
    </div>
  );
}
