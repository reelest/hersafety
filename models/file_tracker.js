import { Item, Model, USES_EXACT_IDS } from "./lib/model";

class PendingDelete extends Item {
  path = "";
  timestamp = Date.now();
}

export const FileTracker = new Model("pending_deletes", PendingDelete, {
  [USES_EXACT_IDS]: true,
});
