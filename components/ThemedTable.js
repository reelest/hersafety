import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import Box from "./Box";
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

function ThemedTable({ results, headers, title, renderHooks = [] }) {
  const { data, ...controller } = usePager(results || [], 10);
  const [selected, setSelected] = useState(-1);
  return (
    <Box boxClass="px-8 py-6" className="my-6">
      <TableHeader>
        <h3 className="font-32b">{title}</h3>
        <TableButton>
          Delete
          <TrashIcon className="ml-0.5 relative top-1" width={20} />
        </TableButton>
      </TableHeader>
      <Table
        loading={!results}
        scrollable
        cols={headers.length}
        rows={Math.min(10, results?.length)}
        headers={headers}
        rowSpacing={1}
        headerClass="text-disabled text-left"
        rowClass={(row) =>
          `${selected === row ? "bg-primaryLight text-white" : "bg-white"} ${
            row >= data.length ? "invisible" : "shadow-3"
          }`
        }
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
      <div className="flex items-center mt-28">
        <Spacer />
        <span className="font-32b mr-4">Total</span>
        <span className="font-20t text-disabled">{results?.length}</span>
        <Spacer />
        <Pager controller={controller} />
      </div>
    </Box>
  );
}
export default ThemedTable;
