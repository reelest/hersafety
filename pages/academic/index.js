import { useEffect, useMemo, useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import { ProfilePic } from "@/components//ProfilePic";
import ThemedButton from "@/components/ThemedButton";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import * as Scoring from "@/logic/scoring";
import {
  addClassToColumns,
  addHeaderClass,
  clipColumn,
  supplyValue,
} from "@/components/Table";
import {
  useClassesAPI,
  useResultsAPI,
  useCoursesAPI,
  useStudentsResultsAPI,
} from "@/logic/api";
import useScrollAnchor from "@/utils/useScrollAnchor";
import uniq from "@/utils/uniq";
import useArrayState from "@/utils/useArrayState";
import Spacer from "@/components/Spacer";
import AppLogo from "@/components/AppLogo";
import TabbedTable from "@/components/TabbedTable";
import range from "@/utils/range";
import useSchool, { SchoolInfo } from "@/logic/schools";

const TABS = {
  courses: {
    name: "Courses",
    component: Courses,
  },
  classes: {
    name: "Classes",
    component: Classes,
  },
  students: {
    name: "Students",
    component: Students,
  },
};

const TAB_NAMES = Object.keys(TABS);
export default function AcademicsView() {
  const [active, setActive] = useArrayState(TAB_NAMES);
  const [schoolType, setSchoolType] = useSchool();
  const ActiveTab = TABS[active].component;
  const scrollAnchor = useScrollAnchor(ActiveTab);
  return (
    <div className="pt-8 flex flex-col pr-12 pl-8">
      {scrollAnchor}
      <div className="text-right w-full">
        <ProfilePic />
      </div>
      <h1 className="font-36b">Academics</h1>
      <div className="flex border-b border-transparentGray py-8 mb-8 justify-end">
        <ul>
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
        <Spacer />
        <select
          className="select-1"
          value={schoolType}
          onChange={(e) => setSchoolType(e.target.value)}
        >
          {Object.keys(SchoolInfo).map((e) => (
            <option value={e} key={e}>
              {SchoolInfo[e].name}
            </option>
          ))}
        </select>
      </div>
      <h2 className="font-32b">{TABS[active].name}</h2>
      <ActiveTab schoolType={schoolType} />
      <div className="h-8" />
    </div>
  );
}

function Courses({ schoolType }) {
  const classes = useClassesAPI(schoolType)?.classes;
  const tabs = classes?.map((e) => e.class)?.filter(uniq);
  const [currentClass, selectClass] = useArrayState(tabs);
  const courses = useCoursesAPI(currentClass)?.courses;

  const branches = useMemo(
    () =>
      classes &&
      classes
        .map((e) => e.branch)
        .sort()
        .filter(uniq),
    [classes]
  );
  const [branch, setBranch] = useArrayState(branches);

  const filtered = useMemo(
    () => courses && courses.filter((e) => e.branch === branch),
    [branch, courses]
  );
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Create a new course</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>

      <TabbedTable
        currentTab={currentClass}
        actions={{
          //eslint-disable-next-line no-unused-vars
          onEdit(_row) {},
          //eslint-disable-next-line no-unused-vars
          onDelete(_row) {},
          print: true,
        }}
        onSelectTab={selectClass}
        tabHeaders={tabs}
        printHeader={
          <>
            <AppLogo />
            <h1>Courses</h1>
          </>
        }
        headerContent={
          <>
            {/* Use span because of justify-between */}
            <span />
            <select
              className="select-1"
              onChange={(e) => {
                setBranch(e.target.value);
              }}
              value={branch}
            >
              {branches
                ? branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {currentClass}, {branch}
                    </option>
                  ))
                : null}
            </select>
          </>
        }
        headers={["NAME", "DESCRIPTION", "ASSIGNED TEACHER"]}
        results={filtered}
        renderHooks={[
          addClassToColumns("min-w-[240px]", [0]),
          addClassToColumns("min-w-[120px]", [2]),
          supplyValue((row, col) => {
            const item = filtered[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return item.name;
              case 1:
                return item.desc;
              case 2:
                return item.assignedTeacher;
            }
          }),
          clipColumn(1, "max-w-[30vw] pr-8"),
        ]}
      />
    </>
  );
}

function Classes({ schoolType }) {
  const tabs = ["Created Classes"];
  const [currentClass, selectClass] = useArrayState(tabs);
  const classes = useClassesAPI(schoolType)?.classes;
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Create a new course</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>

      <TabbedTable
        currentTab={currentClass}
        onSelectTab={selectClass}
        actions={{
          //eslint-disable-next-line no-unused-vars
          onEdit(_row) {},
          //eslint-disable-next-line no-unused-vars
          onDelete(_row) {},
          print: true,
        }}
        tabHeaders={tabs}
        printHeader={
          <>
            <AppLogo />
            <h1>Courses</h1>
          </>
        }
        headers={["S/N", "CLASS", "ASSIGNED TEACHER"]}
        results={classes}
        renderHooks={[
          addClassToColumns("w-0", [0, 1]),
          supplyValue((row, col) => {
            const item = classes[row];
            if (!item) return "--";
            switch (col) {
              case 0:
                return row + 1;
              case 1:
                return item.class + ", " + item.branch;
              case 2:
                return item.assignedTeacher;
            }
          }),
          clipColumn(1, "max-w-[30vw] pr-8"),
        ]}
      />
    </>
  );
}

function Students({ schoolType }) {
  const classes = useClassesAPI(schoolType)?.classes;
  const tabs = classes?.map((e) => e.class)?.filter(uniq);
  const [currentClass, selectClass] = useArrayState(tabs);
  let [viewedStudent, setViewedStudent] = useState(null);
  const branches = useMemo(
    () =>
      classes &&
      classes
        .map((e) => e.branch)
        .sort()
        .filter(uniq),
    [classes]
  );
  const [branch, setBranch] = useArrayState(branches);
  const results = useResultsAPI(currentClass, branch)?.results;

  useEffect(() => {
    setViewedStudent(null);
  }, [branch]);
  return (
    <>
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
      </div>

      {viewedStudent ? (
        <ViewStudent
          tabHeaders={tabs}
          currentTab={currentClass}
          onSelectTab={selectClass}
          student={viewedStudent}
        />
      ) : (
        <TabbedTable
          tabHeaders={tabs}
          currentTab={currentClass}
          onSelectTab={selectClass}
          headerContent={
            <>
              {/* Use span because of justify-between */}
              <span />
              <select
                className="select-1"
                onChange={(e) => {
                  setBranch(e.target.value);
                }}
                value={branch}
              >
                {branches
                  ? branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {currentClass}, {branch}
                      </option>
                    ))
                  : null}
              </select>
            </>
          }
          onClickRow={(row) => {
            setViewedStudent(results[row]);
          }}
          headers={["S/N", "Name", "FIRST TEST", "MID TERM", "PNA", "EXAM"]}
          results={results}
          renderHooks={[
            addClassToColumns("min-w-[240px]", [1]),
            addClassToColumns("w-0", [0]),
            ({ row, col, classes, next }) => {
              if (row < 0 && col > 0) {
                return next({ classes: classes.concat("text-center") });
              }
              return next();
            },
            addHeaderClass("w-32"),
            addClassToColumns("w-24 text-center", range(1, 7)),
            supplyValue((row, col) => {
              const item = results[row];
              if (!item) return "--";
              switch (col) {
                case 0:
                  return row + 1;
                case 1:
                  return item.name;
                case 2:
                  return item.firstTest;
                case 3:
                  return item.midTerm;
                case 4:
                  return item.pna;
                case 5:
                  return item.exam;
              }
            }),
            ({ row, col, classes, data, next }) => {
              if (row >= 0 && col > 1) {
                return next({
                  classes: classes.concat(
                    Scoring.isScoreFail(data) ? "text-secondary" : ""
                  ),
                  data: data + "%",
                });
              }
              return next();
            },
            clipColumn(1, "max-w-[30vw] pr-8"),
          ]}
        />
      )}
    </>
  );
}

function ViewStudent({ student, ...props }) {
  const results = useStudentsResultsAPI(student.id)?.results;

  return (
    <TabbedTable
      showPager={false}
      {...props}
      printHeader={
        <>
          <AppLogo />
          <h1>Result of {student.name}</h1>
        </>
      }
      headers={[
        "Subject",
        "FIRST TEST",
        "MID TERM",
        "PNA",
        "EXAM",
        "Total",
        "Grade",
      ]}
      actions={{
        //eslint-disable-next-line no-unused-vars
        onEdit(_row) {},
        //eslint-disable-next-line no-unused-vars
        onDelete(_row) {},
        print: true,
      }}
      results={results}
      renderHooks={[
        addClassToColumns("min-w-[240px]", [0]),
        ({ row, col, classes, next }) => {
          if (row < 0 && col > 1) {
            return next({ classes: classes.concat("text-center") });
          }
          return next();
        },
        addHeaderClass("w-48"),
        addClassToColumns("w-0 text-center", range(1, 8)),
        supplyValue((row, col) => {
          const item = results[row];
          if (!item) return "--";
          switch (col) {
            case 0:
              return item.subject;
            case 1:
              return item.firstTest;
            case 2:
              return item.midTerm;
            case 3:
              return item.pna;
            case 4:
              return item.exam;
            case 5:
              return Scoring.getSubjectTotal(item);
            case 6:
              return Scoring.getGrade(item);
          }
        }),
        ({ row, col, classes, data, next }) => {
          if (row >= 0 && col > 1 && col < 6) {
            return next({
              classes: classes.concat(
                Scoring.isScoreFail(data) ? "text-secondary" : ""
              ),
              data: data + "%",
            });
          }
          return next();
        },
      ]}
      footerContent={
        results ? (
          <>
            <div className="flex font-24t mt-16 mb-4 w-[640px] max-w-full flex-wrap">
              <span className="py-3 pr-20 basis-1/2 flex-shrink-0">
                Marks Obtained: {Scoring.getTotalMarks(results)}
              </span>
              <span className="py-3 pr-20 basis-1/2 flex-shrink-0">
                Average: {Scoring.getAverage(results)}
              </span>
              <span className="py-3 pr-20 basis-1/2 flex-shrink-0">
                C.G.P.A: {Scoring.getCGPA(results)}
              </span>
              <span className="py-3 pr-20 basis-1/2 flex-shrink-0">
                Class: {Scoring.getClass(results)}
              </span>
            </div>
          </>
        ) : null
      }
    />
  );
}
