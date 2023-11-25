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
import "@fontsource/inter";
import sentenceCase from "@/utils/sentenceCase";

export default function Test(props) {
  return (
    <div className="flex bg-white flex-wrap">
      <ClassDiagram model={Admins} />;
      <ClassDiagram model={Users} />;
      <ClassDiagram model={Polices} />;
      <ClassDiagram
        model={getContacts({
          id() {
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
    </div>
  );
}

/**
 *
 * @param {{model:import("@/models/lib/model_type_info").Model}} props
 */
function ClassDiagram({ model }) {
  return (
    <div
      style={{ border: "1px solid silver", fontFamily: "Inter  " }}
      className="inline-flex flex-col m-10  rounded-lg"
    >
      <div
        className="p-4 text-blue-700"
        style={{ borderBottom: "1px solid silver", fontFamily: "Poppins  " }}
      >
        {sentenceCase(model.uniqueName()).replace(/_./g, (e) =>
          e[1].toUpperCase()
        )}
      </div>
      <ul className="p-4 pe-10 ps-6" style={{ lineHeight: 1.75 }}>
        {model.fields().map((e) => (
          <li key={e} className="flex justify-between text-slate-700">
            {e}{" "}
            <small className="ms-10">
              <i className="text-green-700">
                {model.Meta[e].type === "ref" ? (
                  <>
                    {"Ref<"}
                    {
                      <span className="text-blue-700">
                        {sentenceCase(
                          model.Meta[e].refModel.uniqueName()
                        ).replace(/_./g, (e) => e[1].toUpperCase())}
                      </span>
                    }
                    {">"}
                  </>
                ) : (
                  model.Meta[e].type
                )}
              </i>
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
}
