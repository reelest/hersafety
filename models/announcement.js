import { Model, Item } from "./model";

export class Announcement extends Item {}
const Announcements = new Model("annoucements", Announcement);
export default Announcements;
