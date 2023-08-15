import { Model, Item } from "./model";

class Event extends Item {
  date = Date.now();
  title = "Untitled";
  scope = {
    teachers: true,
    parents: true,
    students: true,
    admins: true,
  };
}
const Events = new Model("events", Event);
export default Events;
