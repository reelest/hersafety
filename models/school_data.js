import { ItemDoesNotExist, checkError } from "./errors";
import Misc from "./misc";

const SchoolData = (async () => {
  const data = Misc.getOrCreate("info");
  if (data.isLocalOnly()) {
    Object.assign(data, {
      currentSession: "2022/2023",
    });
  }
  return data;
})();
export default function getSchoolData() {
  return SchoolData;
}
