import { useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import ThemedButton from "@/components/ThemedButton";
import { ProfilePic } from "@/components//ProfilePic";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import {
  addClassToColumns,
  supplyValue,
  useColumnSelect,
} from "@/components/Table";
import {
  useAdministratorsAPI,
  useParentsAPI,
  useStudentsAPI,
  useTeachersAPI,
} from "@/logic/api";
import { formatDate } from "@/utils/formatNumber";
import useScrollAnchor from "@/utils/useScrollAnchor";
import ThemedTable from "@/components/ThemedTable";
import AddAdminModal from "@/parts/admin_users/AddAdminModal";
import useModal from "@/utils/useModal";

const TABS = {
  administrators: {
    name: "Administrators",
    component: Administrators,
  },
  teachers: {
    name: "Teachers",
    component: Teachers,
  },
  parents: {
    name: "Parents",
    component: Parents,
  },
  students: {
    name: "Students",
    component: Students,
  },
};

export default function UsersView() {
  const [active, setActive] = useState("administrators");
  const ActiveTab = TABS[active].component;
  const scrollAnchor = useScrollAnchor(ActiveTab);
  return (
    <div className="pt-8 flex flex-col pr-12 pl-8">
      {scrollAnchor}
      <div className="text-right w-full">
        <ProfilePic />
      </div>
      <h1 className="font-36b">Users</h1>
      <ul className="border-b border-transparentGray py-8 mb-8">
        {Object.keys(TABS).map((e) => (
          <ThemedButton
            as="li"
            variant="classic"
            bg={active === e ? "bg-primaryLight" : "bg-white"}
            color={active === e ? "text-white" : "text-black2"}
            onClick={() => setActive(e)}
            className="inline-block mx-4 shadow-1"
            key={e}
          >
            {TABS[e].name}
          </ThemedButton>
        ))}
      </ul>
      <h2 className="font-32b">{TABS[active].name}</h2>
      <ActiveTab />
      <div className="h-8" />
    </div>
  );
}

function Administrators() {
  const admins = useAdministratorsAPI()?.admins;
  const [toggle, modal] = useModal(<AddAdminModal />);

  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton
          variant="classic"
          className="flex items-center my-2"
          onClick={toggle}
        >
          <span>Add new administrator</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>
      <ThemedTable
        headers={["Name", "Email", "Date Created", "Status"]}
        results={admins}
        renderHooks={[
          addClassToColumns("text-center", [3]),
          addClassToColumns("min-w-[240px]", [0]),
          supplyValue((row, col) => {
            const item = admins[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return formatDate(item.dateCreated);
              case 3:
                return (
                  <span
                    className={`inline-block w-4 h-4 rounded-full border align-middle border-transparentGray ${
                      item.status ? "bg-green-500" : "bg-black2"
                    }`}
                  ></span>
                );
            }
          }),
        ]}
      />
      {modal}
    </>
  );
}

function Teachers() {
  const teachers = useTeachersAPI("high school")?.teachers;
  const montessoriTeachers = useTeachersAPI("montessori")?.teachers;
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Add new teacher</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>
      <ThemedTable
        title="High School"
        results={teachers}
        headers={["Name", "Email", "Subject", "Status"]}
        renderHooks={[
          addClassToColumns("text-center", [3]),
          addClassToColumns("min-w-[240px]", [0]),
          supplyValue((row, col) => {
            const item = teachers[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return item.subject;
              case 3:
                return item.class || "None";
            }
          }),
        ]}
      />
      <ThemedTable
        title="Montessori"
        results={montessoriTeachers}
        headers={["Name", "Email", "Subject", "Status"]}
        renderHooks={[
          addClassToColumns("text-center", [3]),
          addClassToColumns("min-w-[240px]", [0]),
          supplyValue((row, col) => {
            const item = montessoriTeachers[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return item.subject;
              case 3:
                return item.class || "None";
            }
          }),
        ]}
      />
    </>
  );
}

function Parents() {
  const parents = useParentsAPI()?.parents;
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Add new parent</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>
      <ThemedTable
        headers={["Name", "Email", "Pupil Count", "Status"]}
        results={parents}
        renderHooks={[
          addClassToColumns("text-center", [3]),
          addClassToColumns("min-w-[240px]", [0]),
          supplyValue((row, col) => {
            const item = parents[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return item.numPupils;
              case 3:
                return (
                  <span
                    className={`inline-block w-4 h-4 rounded-full border align-middle border-transparentGray ${
                      item.status ? "bg-green-500" : "bg-black2"
                    }`}
                  ></span>
                );
            }
          }),
        ]}
      />
    </>
  );
}
function Students() {
  const all_students = useStudentsAPI()?.students;
  const [students, renderHook] = useColumnSelect(
    all_students,
    (e) => e.class,
    2
  );
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Add new parent</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>
      <ThemedTable
        title="High School"
        headers={["Name", "Email", null, "Status"]}
        results={students}
        renderHooks={[
          renderHook,
          addClassToColumns("text-center", [3]),
          addClassToColumns("min-w-[240px]", [0]),
          supplyValue((row, col) => {
            const item = students[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return item.class;
              case 3:
                return (
                  <span
                    className={`inline-block w-4 h-4 rounded-full border align-middle border-transparentGray ${
                      item.status ? "bg-green-500" : "bg-black2"
                    }`}
                  ></span>
                );
            }
          }),
        ]}
      />
      <ThemedTable
        title="Montessori"
        headers={["Name", "Email", null, "Status"]}
        results={students}
        renderHooks={[
          renderHook,
          addClassToColumns("text-center", [3]),
          addClassToColumns("min-w-[240px]", [0]),
          supplyValue((row, col) => {
            const item = students[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.email;
              case 2:
                return item.class;
              case 3:
                return (
                  <span
                    className={`inline-block w-4 h-4 rounded-full border align-middle border-transparentGray ${
                      item.status ? "bg-green-500" : "bg-black2"
                    }`}
                  ></span>
                );
            }
          }),
        ]}
      />
    </>
  );
}
