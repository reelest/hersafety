import { Model, Item } from "./model";

class Announcement extends Item {}
const Announcements = new Model("annoucements", Announcement);
export default Announcements;
