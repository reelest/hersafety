import { Sessions } from "@/models/session";
import { createSharedQuery, useQuery } from "@/models/lib/query";
import createSubscription from "@/utils/createSubscription";
import useArrayState from "@/utils/useArrayState";
import { MenuItem, Select, Typography } from "@mui/material";

const [useCurrentSession, , setCurrentSession] = createSubscription();
const [useSessions] = createSharedQuery(Sessions.counter.asQuery());

export default function SessionSelect() {
  const { data: sessionData } = useSessions();
  console.log({ sessionData });
  const sessions = sessionData?.sessions;
  const currentSession = useCurrentSession();

  return sessions ? (
    sessions.length === 0 ? (
      <Typography color="error">No sessions yet.</Typography>
    ) : (
      <Select
        value={currentSession}
        onChange={(e) => setCurrentSession(e.target.value)}
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
