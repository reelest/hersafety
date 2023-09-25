import { useEffect, useRef, useState } from "react";
import ThemedButton from "@mui/material/Button";
import Table, {
  TableContext,
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  pageData,
} from "@/components/Table";
import usePager from "@/utils/usePager";
import Pager from "@/components/Pager";
import printElement from "@/utils/printElement";
import Printed from "@/components/Printed";
import TabbedBox from "./TabbedBox";
import ThemedTable from "./ThemedTable";

export default function TabbedTable({
  results,
  headers,
  tabHeaders,
  onSelectTab,
  currentTab,
  headerContent,
  printHeader,
  footerContent,
  renderHooks,
  onClickRow,
  pager,
  showPager = true,
  actions,
}) {
  const PAGE_SIZE = showPager ? 10 : 1000;
  const tableRef = useRef();
  const [selected, setSelected] = useState(-1);
  useEffect(() => setSelected(-1), [pager.page, results]);
  return (
    <TabbedBox
      tabHeaders={tabHeaders}
      onSelectTab={onSelectTab}
      currentTab={currentTab}
    >
      <div className="h-6" />
      <TableHeader>{headerContent}</TableHeader>
      <div ref={tableRef}>
        <Printed className="hidden print:block py-10">{printHeader}</Printed>
        <ThemedTable
          container={TableContext.Provider}
          value={[selected, setSelected]}
          results={results}
          headers={headers}
          selected={selected}
          pager={pager}
          renderHooks={renderHooks}
          tableRef={tableRef}
          onClickRow={onClickRow}
        />
      </div>
      {footerContent}
      <TabActions
        actions={actions}
        selected={(pager.page - 1) * PAGE_SIZE + selected}
        tableRef={tableRef}
      />
    </TabbedBox>
  );
}

export function TabActions({ actions, selected, tableRef }) {
  return actions ? (
    <div className="flex justify-end mt-8">
      {actions.onEdit ? (
        <ThemedButton
          disabled={selected === -1}
          onClick={() => actions.onEdit(selected)}
          bg="primary"
          variant="classic"
          className="mx-2"
        >
          Edit
        </ThemedButton>
      ) : null}
      {actions.onDelete ? (
        <ThemedButton
          disabled={selected === -1}
          onClick={() => actions.onDelete(selected)}
          bg="secondary"
          variant="classic"
          className="mx-2"
        >
          Delete
        </ThemedButton>
      ) : null}
      {actions.print ? (
        <ThemedButton
          onClick={() => printElement(tableRef.current)}
          variant="classic"
          className="mx-2"
        >
          Print
        </ThemedButton>
      ) : null}
      {actions.onClose ? (
        <ThemedButton
          onClick={actions.onClose}
          variant="classic"
          bg="primary"
          className="mx-2"
        >
          Close
        </ThemedButton>
      ) : null}
    </div>
  ) : null;
}
