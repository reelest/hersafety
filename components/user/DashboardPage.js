import { startPanic, stopPanic, usePanic } from "@/logic/panic_alert";
import {
  Box,
  Button,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Typography,
} from "@mui/material";
import { Danger } from "iconsax-react";
import ModelForm from "../ModelForm";
import Complaints from "@/models/complaint";
import { useState } from "react";
import { green, red } from "@mui/material/colors";

export default function DashboardPage() {
  const panic = usePanic();
  console.log(panic);
  const [item, setItem] = useState(Complaints.create());
  return (
    <Box className="px-6 md:px-12 flex flex-col items-center py-12">
      <Button
        variant="contained"
        size="large"
        onClick={panic ? stopPanic : panic === false ? startPanic : null}
        sx={{
          height: 240,
          width: 240,
          borderRadius: "50%",
          backgroundColor: panic ? red[700] : green[100],
        }}
      >
        <Danger
          size={128}
          className={panic ? "text-red-200" : "text-green-400"}
        />
      </Button>
      <Typography
        variant="h4"
        paragraph
        color={panic ? "red" : "green"}
        sx={{ mt: 5 }}
      >
        {" "}
        I'm in Trouble!!!
      </Typography>
      <Card className="mt-24 px-6 py-8" elevation={12}>
        <CardHeader title="Create Complaint">
          <Typography variant="h3">Create Complaint</Typography>
        </CardHeader>
        <CardContent>
          <ModelForm
            model={Complaints}
            title="Create Complaint"
            item={item}
            submitText={"Submit Complaint"}
            onSubmit={() => {
              setItem(Complaints.create());
            }}
          />
        </CardContent>
      </Card>
    </Box>
  );
}
