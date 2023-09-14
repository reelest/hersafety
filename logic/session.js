import { createSharedQuery } from "@/models/lib/query";
import { Sessions } from "@/models/session";
import { noop } from "@/utils/none";

const SessionInfo = Sessions.counter.asQuery();
export const [useSessions, onNewSessions, , getSessions] =
  createSharedQuery(SessionInfo);

onNewSessions(noop);
export const { _query: SessionQuery } = getSessions();
