import { useEffect, useMemo, useRef, useState } from "react";
import { SearchInput } from "@/components/SearchInput";
import Table, { addClassToColumns, supplyValue } from "@/components/Table";
import { ProfilePic } from "@/components//ProfilePic";
import { useClassesAPI, usePaymentsAPI } from "@/logic/api";
import { formatDate, formatNumber, formatTime } from "@/utils/formatNumber";
import uniq from "@/utils/uniq";
import useArrayState from "@/utils/useArrayState";
import Spacer from "@/components/Spacer";
import AppLogo from "@/components/AppLogo";
import TabbedTable, { TabActions } from "@/components/TabbedTable";
import useSchool, { SchoolInfo } from "@/logic/schools";
import TabbedBox from "@/components/TabbedBox";

export default function FinancialsView() {
  const [schoolType, setSchoolType] = useSchool();
  const classes = useClassesAPI(schoolType)?.classes;
  const tabs = classes?.map((e) => e.class)?.filter(uniq);
  const [currentClass, selectClass] = useArrayState(tabs);
  const payments = usePaymentsAPI(currentClass)?.payments;
  const [viewedPayment, setViewedPayment] = useState();
  useEffect(() => setViewedPayment(null), [currentClass]);
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
      <h1 className="font-36b">Financial</h1>
      <div className="flex border-b border-transparentGray py-8 mb-8 justify-end">
        <SearchInput />
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
      <div className="h-8" />
      {viewedPayment ? (
        <ViewPayment
          tabHeaders={tabs}
          onSelectTab={selectClass}
          currentTab={currentClass}
          data={viewedPayment}
          onClose={() => setViewedPayment(null)}
        />
      ) : (
        <TabbedTable
          currentTab={currentClass}
          onSelectTab={selectClass}
          tabHeaders={tabs}
          onClickRow={(row) => setViewedPayment(payments[row])}
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
                onChange={(e) => setSort(e.target.value)}
                value={sort}
              >
                <option value="latest">Latest Payments</option>
                <option value="name">Alphabetical Order</option>
                <option value="amount">Lowest to Highest</option>
              </select>
            </>
          }
          headers={["S/N", "Name", "Description", "Amount", "Date", "Time"]}
          results={filtered}
          renderHooks={[
            addClassToColumns("min-w-[240px]", [1]),
            addClassToColumns("min-w-[120px]", [3]),
            // addClassToColumns("text-right", [4]),
            supplyValue((row, col) =>
              col === 0 ? (
                row + 1
              ) : col === 1 ? (
                payments[row].name
              ) : col === 2 ? (
                <span className="inline-block align-bottom w-56 whitespace-nowrap overflow-hidden text-ellipsis">
                  {payments[row].desc}
                </span>
              ) : col === 3 ? (
                "N" + formatNumber(payments[row].amount)
              ) : col === 4 ? (
                formatDate(payments[row].date)
              ) : (
                formatTime(payments[row].date).toLowerCase()
              )
            ),
          ]}
        />
      )}
    </div>
  );
}

const labels = {
  id: {
    label: "Payment ID",
  },
  category: {
    label: "Category",
  },
  studentName: {
    label: "Student",
  },
  session: {
    label: "Session",
  },
  ticketCreationDate: {
    label: "Ticket creation date",
    render(e) {
      return formatDate(e) + ", " + formatTime(e);
    },
  },
  amount: {
    label: "Amount authorized",
    render(e) {
      return "N " + formatNumber(e);
    },
  },
  payerName: {
    label: "Parent/payers name",
  },
  paymentType: {
    label: "Payment type",
  },
};
function ViewPayment({ data, onClose, ...props }) {
  const divRef = useRef();
  const rows = useMemo(
    () => Object.keys(data).filter(Object.hasOwnProperty, labels),
    [data]
  );
  return (
    <TabbedBox {...props}>
      <div className="h-12" />
      <div ref={divRef} className="max-w-full w-[48rem] mx-auto">
        <h3 className="font-36 text-center mb-2">
          {data.name} Payment Invoice/Details
        </h3>
        <Table
          cols={2}
          rows={rows.length}
          bodyClass="font-24"
          renderHooks={[
            addClassToColumns("border py-3 px-8 border-black"),
            supplyValue((row, col) => {
              const e = rows[row];
              return col === 0
                ? labels[e].label
                : labels[e].render
                ? labels[e].render(data[e])
                : data[e];
            }),
          ]}
        />
      </div>
      <div className="mt-16 max-w-full w-[48rem] mx-auto">
        <TabActions actions={{ print: true, onClose }} tableRef={divRef} />
      </div>
    </TabbedBox>
  );
}
