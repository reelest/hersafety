import { Table, Item } from "./table";

class Announcement extends Item {}
const Announcements = new Table("annoucements", Announcement);
export default Announcements;
