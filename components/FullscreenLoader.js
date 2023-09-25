import { useTheme } from "@mui/material";
import LoaderAnimation from "./LoaderAnimation";
import usePromise from "@/utils/usePromise";
import delay from "@/utils/delay";

export default function FullscreenLoader() {
  const theme = useTheme();
  const delaying = usePromise(async () => (await delay(10000)) || true, []);
  return (
    <div
      style={{ color: theme.palette.primary.light }}
      className="fixed font-24b flex-col bg-bg bg-opacity-90 inset-0 h-screen flex justify-center items-center"
    >
      <LoaderAnimation className="w-12 my-10" />
      &nbsp;
      {delaying ? (
        <span className="text-error">
          Loading is taking longer than usual. If issue persists, please reload
          the page.
        </span>
      ) : (
        <>Please wait...</>
      )}
    </div>
  );
}
