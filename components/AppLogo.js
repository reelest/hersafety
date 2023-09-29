import { Typography } from "@mui/material";
import Template from "./Template";
export default function AppLogo({ ...props }) {
  return (
    <Template className="flex justify-center my-2" props={props}>
      <div className="rounded-full bg-secondary px-6 py-4">
        <Typography variant="h4" sx={{ color: "white" }}>
          MOUOA
        </Typography>
      </div>
    </Template>
  );
}
