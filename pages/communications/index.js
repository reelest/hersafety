import { useEffect, useMemo, useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import ThemedButton from "@/components/ThemedButton";
import { ProfilePic } from "@/components//ProfilePic";
import PlusCircleIcon from "@heroicons/react/20/solid/PlusCircleIcon";
import { useAdminDashboardAPI, usePaymentsAPI } from "@/logic/api";
import useArrayState from "@/utils/useArrayState";
import Spacer from "@/components/Spacer";
import AppLogo from "@/components/AppLogo";
import TabbedBox from "@/components/TabbedBox";
import useSchool, { SchoolInfo } from "@/logic/schools";
import Printed from "@/components/Printed";
import Pager from "@/components/Pager";
import usePager from "@/utils/usePager";
import Table, {
  TableHeader,
  addClassToColumns,
  supplyValue,
} from "@/components/Table";
import sentenceCase from "@/utils/sentenceCase";
import range from "@/utils/range";
import Row from "@/components/Row";
import { useCounter } from "react-use";
import CalendarIcon from "@heroicons/react/20/solid/CalendarIcon";
import ArrowLeftIcon from "@heroicons/react/20/solid/ArrowLeftIcon";
import ArrowRightIcon from "@heroicons/react/20/solid/ArrowRightIcon";
import TextButton from "@/components/TextButton";

export default function CommunicationsView() {
  const [schoolType, setSchoolType] = useSchool();
  const tabs = ["Announcements", "Events"];
  const [currentClass, selectClass] = useArrayState(tabs);
  const payments = usePaymentsAPI(currentClass)?.payments;

  const [sort, setSort] = useState("latest");
  const filtered = useMemo(
    () =>
      payments &&
      payments
        .slice()
        .sort((a, b) =>
          sort === "latest"
            ? a.date - b.date
            : sort == "name"
            ? a.name.localeCompare(b.name)
            : a.amount - b.amount
        ),
    [payments, sort]
  );

  return (
    <div className="pt-8 flex flex-col pr-12 pl-8">
      <div className="text-right w-full">
        <ProfilePic />
      </div>
      <div className="flex border-b border-transparentGray py-8 mb-8 justify-end">
        <h1 className="font-36b">Communication</h1>
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
      <div className="flex flex-wrap items-center justify-center mt-4 mb-8">
        <SearchInput />
        <ThemedButton variant="classic" className="flex items-center my-2">
          <span>Create an announcement</span>
          <PlusCircleIcon className="ml-3" width={20} />
        </ThemedButton>
      </div>
      <div className="h-10" />
      <TabbedBox
        currentTab={currentClass}
        onSelectTab={selectClass}
        tabHeaders={tabs}
        noPadding={currentClass === "Events"}
      >
        {currentClass === "Events" ? (
          <Calendar />
        ) : (
          <Announcements
            headerContent={
              <>
                {/* Use span because of justify-between */}
                <span />
                <select
                  className="select-1"
                  onChange={(e) => setSort(e.target.value)}
                  value={sort}
                >
                  <option value="latest">Latest Payments</option>
                  <option value="name">Alphabetical Order</option>
                  <option value="amount">Lowest to Highest</option>
                </select>
              </>
            }
            printHeader={
              <>
                <AppLogo />
                <h1>Courses</h1>
              </>
            }
            results={filtered}
            renderItem={() => (
              <div className="rounded-lg shadow-3 m-4 py-5 px-5">
                <div className="flex justify-between">
                  <h6 className="font-24b">Upcoming Event - CSMS</h6>
                  <p>Posted on May 15, 2023</p>
                </div>
                <p>
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                  Repudiandae, in aliquam? Architecto mollitia officia illo vero
                  velit repellendus suscipit accusamus similique. Consequatur
                  nihil maxime temporibus praesentium ullam aut numquam
                  mollitia?Lorem ipsum dolor sit amet consectetur adipisicing
                  elit. Neque ipsa iure animi error laboriosam eaque distinctio
                  possimus tempora hic ipsum deleniti blanditiis, labore sequi
                  culpa nemo iste reprehenderit quae praesentium?
                </p>
              </div>
            )}
          />
        )}
      </TabbedBox>
    </div>
  );
}

const PAGE_SIZE = 3;
function Announcements({ headerContent, results, printHeader, renderItem }) {
  const { data, ...controller } = usePager(results || [], PAGE_SIZE);
  const [, setSelected] = useState(-1);
  useEffect(() => setSelected(-1), [controller.page, results]);
  return (
    <>
      <div className="h-6" />
      <TableHeader>{headerContent}</TableHeader>
      <div>
        <Printed className="hidden print:block py-10">{printHeader}</Printed>
        <ul>
          {data?.map?.((e) => renderItem(e, PAGE_SIZE * (controller.page - 1)))}
        </ul>
      </div>
      <div className="flex justify-end mt-28">
        <Pager controller={controller} />
      </div>
    </>
  );
}

const months = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];
const days = ["sun", "mon", "tue", "wed", "thur", "fri", "sat"];
function Calendar({ date = new Date() }) {
  const events = useAdminDashboardAPI()?.events;
  return <WeekView showHeader date={date} events={events} />;
}
/**
 * @param {Object} props
 * @param {Date} props.date
 * @param {Boolean} props.showHeader
 */
function WeekView({ date = new Date(), showHeader, events, rows = null }) {
  const [monthOffset, { inc, reset, dec }] = useCounter(0);
  // The date of today e.g 6
  const today = date.getDate();
  if (monthOffset !== 0) {
    date = new Date(date.getTime());
    date.setMonth(date.getMonth() + monthOffset, 1);
  }
  const firstDayOnRow = date.getDate() - date.getDay();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  // The first day on that row e.g 10

  const rowsBefore = Math.ceil((firstDayOnRow - 1) / 7);
  const getNumDays = (m, y) => {
    return [9, 4, 6, 11].includes(m)
      ? 30
      : m !== 2
      ? 31
      : y % 4 === 0
      ? 29
      : 28;
  };
  const max = getNumDays(month, year);
  if (typeof rows !== "number") {
    rows = Math.ceil((max - firstDayOnRow) / 7) + rowsBefore;
  }
  const todayYear = year + Math.floor((month + monthOffset) / 12);
  const todayMonth = (120000000 + month + monthOffset) % 12;
  return (
    <>
      {showHeader ? (
        <Row className="px-6 py-2 align-middle  bg-primaryDark text-white">
          <span className="font-32t">
            {sentenceCase(months[month - 1])} {year}
          </span>
          <Spacer />
          {monthOffset ? (
            <TextButton
              onClick={() => reset()}
              color="text-white"
              className="pe-2"
            >
              <CalendarIcon width={36} />
            </TextButton>
          ) : null}
          <TextButton
            onClick={() => dec(1)}
            color="text-white"
            className="px-2"
          >
            <ArrowLeftIcon width={36} />
          </TextButton>
          <TextButton
            onClick={() => inc(1)}
            color="text-white"
            className="ps-2"
          >
            <ArrowRightIcon width={36} />
          </TextButton>
        </Row>
      ) : null}
      <Table
        cols={7}
        className="w-full max-w-full bg-primaryDark text-white rounded-b-2xl"
        rows={rows}
        rowClass="last:border-b-0 border-b border-t"
        headerClass=""
        bodyClass=""
        renderHooks={[
          // supplyHeader((col) => ),
          addClassToColumns(
            "text-center w-32 max-w-[14.28%] first:border-l-0 last:border-r-0 border-l border-r border-white",
            range(7)
          ),
          supplyValue((row, col) => {
            let day = firstDayOnRow + col + (row - rowsBefore) * 7;
            let m = month;
            let y = year;
            let t = max;
            let fade = false;
            while (day < 1) {
              m -= 1;
              if (m < 1) {
                m = 12;
                y -= 1;
              }
              t = getNumDays(m, y);
              day += t;
              fade = true;
            }
            while (day > t) {
              m += 1;
              if (m > 12) {
                m = 1;
                y += 1;
              }
              day -= t;
              t = getNumDays(m, y);
              fade = true;
            }
            const showMonth =
              (m < month && day === t) || (m > month && day === 1);
            return (
              <div className="h-32 p-1 flex flex-col items-center overflow-hidden">
                {row === 0 ? (
                  <div className="text-center text-disabled font-16">
                    {sentenceCase(days[col])}
                  </div>
                ) : null}
                <div
                  className={`mb-2 inline-flex items-center justify-center ${
                    fade ? "font-20" : "font-24"
                  } ${
                    day === today && m === todayMonth && y === todayYear
                      ? "rounded-full bg-primaryLight h-8 " +
                        (showMonth ? "px-1" : "w-8")
                      : ""
                  }`}
                >
                  {showMonth ? sentenceCase(months[m - 1]) + " " : ""}
                  {day}
                </div>
                <div className="flex-grow w-12 sm:w-20 md:w-22 xl:w-28 2xl:w-36">
                  {events
                    ? events
                        .filter(
                          (e) =>
                            e.date.getMonth() === m - 1 &&
                            e.date.getFullYear() === y &&
                            e.date.getDate() === day
                        )
                        .map((e) => (
                          <div
                            key={e.title}
                            className="whitespace-nowrap max-w-full overflow-hidden break-all my-1 rounded-full px-1 font-10 sm:font-12 text-ellipsis bg-white text-primaryDark"
                          >
                            {e.title}
                          </div>
                        ))
                    : null}
                </div>
              </div>
            );
          }),
        ]}
      />
    </>
  );
}
