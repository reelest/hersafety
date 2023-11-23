import Admins from "@/models/admin";
import Complaints from "@/models/complaint";
import getContacts from "@/models/contact";
import Locations from "@/models/location";
import Notifications from "@/models/notification";
import PanicAlerts from "@/models/panic_alert";
import Polices from "@/models/police";
import PoliceStations from "@/models/police_station";
import { SearchIndex } from "@/models/search_index";
import Users from "@/models/user";

import sentenceCase from "@/utils/sentenceCase";

export default function Test(props) {
  return (
    <>
      <ClassDiagram model={Admins} />;
      <ClassDiagram model={Users} />;
      <ClassDiagram model={Polices} />;
      <ClassDiagram
        model={getContacts({
          uid() {
            return "[uid]";
          },
        })}
      />
      ;
      <ClassDiagram model={SearchIndex} />;
      <ClassDiagram model={PoliceStations} />;
      <ClassDiagram model={PanicAlerts} />;
      <ClassDiagram model={Notifications} />;
      <ClassDiagram model={Locations} />;
      <ClassDiagram model={Complaints} />;
    </>
  );
}

/**
 *
 * @param {{model:import("@/models/lib/model_type_info").Model}} props
 */
function ClassDiagram({ model }) {
  return (
    <div
      style={{ border: "1px solid black", fontFamily: "Arial  " }}
      className="inline-flex flex-col m-10"
    >
      <div className="p-4" style={{ borderBottom: "1px solid black" }}>
        {sentenceCase(model.uniqueName())}
      </div>
      <ul className="p-4 pe-10" style={{ lineHeight: 1.75 }}>
        {model.fields().map((e) => (
          <li key={e} className="flex justify-between">
            {e}{" "}
            <small className="ms-5">
              <i>{model.Meta[e].type}</i>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
