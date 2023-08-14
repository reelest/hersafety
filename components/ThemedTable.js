import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import Card1 from "./Card1";
import Table, {
  TableButton,
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  pageData,
} from "./Table";
import Spacer from "./Spacer";
import Pager from "./Pager";
import usePager from "@/utils/usePager";
import { useState } from "react";
import { Typography } from "@mui/material";

function ThemedTable({
  container: TableWrapper = ThemedBox,
  results,
  headers,
  renderHooks = [],
  ...props
}) {
  const { data, ...controller } = usePager(results || [], 10);
  const [selected, setSelected] = useState(-1);
  return (
    <TableWrapper {...props}>
      <Table
        loading={!results}
        scrollable
        cols={headers.length}
        rows={Math.min(10, results?.length)}
        headers={headers}
        rowSpacing={1}
        headerClass="text-disabled text-left"
        rowProps={(row) => ({
          sx: {
            backgroundColor: selected === row ? "primary.light" : "white",
            color: selected === row ? "white" : null,
          },

          className: row >= data.length ? "invisible" : "shadow-3",
        })}
        onClickRow={(e, row) => setSelected(selected === row ? -1 : row)}
        renderHooks={[
          pageData(controller.page, 10),
          addHeaderClass("first:pl-4 pr-2 last:pr-0 font-20t"),
          addClassToColumns(
            "first:pl-4 pr-2 pt-1 pb-1 first:rounded-l last:rounded-r"
          ),
          ...renderHooks,
        ]}
      />

      <div className="flex items-center mt-12">
        <Spacer />
        <span className="font-32b mr-4">Total</span>
        <span className="font-20t text-disabled">{results?.length}</span>
        <Spacer />
        <Pager controller={controller} />
      </div>
    </TableWrapper>
  );
}

const ThemedBox = function ({ title, children, ...props }) {
  return (
    <Card1 boxClass="px-6 py-4" className="my-2 mx-2" {...props}>
      <TableHeader>
        <Typography variant="h6">{title}</Typography>
        <TableButton>
          Delete
          <TrashIcon className="ml-0.5 relative" width={20} />
        </TableButton>
      </TableHeader>
      {children}
    </Card1>
  );
};
export default ThemedTable;
