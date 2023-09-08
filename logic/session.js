import { createSharedQuery } from "@/models/lib/query";
import { Sessions } from "@/models/session";

const SessionInfo = Sessions.counter.asQuery();
export const [useSessions, , , getSessions] = createSharedQuery(SessionInfo);
