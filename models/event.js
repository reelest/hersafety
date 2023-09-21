import { Model, Item } from "./lib/model";

export class Event extends Item {
  date = new Date();
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
