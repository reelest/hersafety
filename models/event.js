import { Table, Item } from "./table";

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
const Events = new Table("events", Event);
export default Events;
