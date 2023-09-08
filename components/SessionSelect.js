import createSubscription from "@/utils/createSubscription";
import { MenuItem, Select, Typography } from "@mui/material";
import { useSessions } from "@/logic/session";

const [useSelectedSession, , setSelectedSession] = createSubscription();
export default function SessionSelect() {
  const { data: sessionData } = useSessions();
  console.log({ sessionData });
  const sessions = sessionData?.sessions;
  const currentSession = useSelectedSession();

  return sessions ? (
    sessions.length === 0 ? (
      <Typography color="error">No sessions yet.</Typography>
    ) : (
      <Select
        value={currentSession}
        onChange={(e) => setSelectedSession(e.target.value)}
        size="small"
      >
        {sessions.map((e) => (
          <MenuItem key={e}>{e}</MenuItem>
        ))}
      </Select>
    )
  ) : (
    <Typography>Loading sessions...</Typography>
  );
}
