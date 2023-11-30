import { Box } from "@mui/material";
import ModelForm from "../ModelForm";
import useUserData from "../../logic/user_data";

export default function MyInfoPage() {
  const user = useUserData();
  return (
    <Box>
      <ModelForm model={user} />
    </Box>
  );
}
