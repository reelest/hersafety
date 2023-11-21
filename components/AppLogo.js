import { Typography } from "@mui/material";
import Template from "./Template";
export default function AppLogo({ ...props }) {
  return (
    <Template className="flex justify-center my-2" props={props}>
      <div className="rounded-b-lg rounded-t-3xl bg-secondary px-6 pt-4 pb-3">
        <Typography variant="h6" sx={{ letterSpacing: 1.5, color: "white" }}>
          GUARDIAN
        </Typography>
      </div>
    </Template>
  );
}
