import { Model, Item } from "./lib/model";

export class Announcement extends Item {}
const Announcements = new Model("annoucements", Announcement);
export default Announcements;
