import { Item, Model } from "./lib/model";

class PendingDelete extends Item {
  path = "";
  time = Date.now();
}
export const FileTracker = new Model("pending_deletes", PendingDelete);
