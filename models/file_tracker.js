import { Item, Model } from "./lib/model";

class PendingDelete extends Item {
  path = "";
  timestamp = Date.now();
}
export const FileTracker = new Model("pending_deletes", PendingDelete);
