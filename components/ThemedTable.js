import TrashIcon from "@heroicons/react/20/solid/TrashIcon";
import Card1 from "./Card1";
import Table, {
  TableButton,
  TableContext,
  TableHeader,
  addClassToColumns,
  addHeaderClass,
  pageData,
} from "./Table";
import Spacer from "./Spacer";
import Pager from "./Pager";
import usePager from "@/utils/usePager";
import { Typography } from "@mui/material";
import Await from "./Await";

function ThemedTable({
  container: TableWrapper = ThemedBox,
  results,
  headers,
  renderHooks = [],
  selected,
  pager: _pager,
  tableRef,
  onClickRow,
  ...props
}) {
  const defaultPager = usePager(results || [], 10);
  /** @type {typeof defaultPager} */
  const pager = _pager ?? defaultPager;
  const { data, pageSize, ...controller } = pager;
  return (
    <TableWrapper selected={selected} {...props}>
      <Table
        loading={!results}
        data={results}
        scrollable
        tableRef={tableRef}
        onClickRow={onClickRow}
        cols={headers.length}
        rows={Math.min(pageSize, results?.length)}
        headers={headers}
        rowSpacing={1}
        headerClass="text-disabled text-left"
        rowProps={(row) => ({
          sx: {
            backgroundColor: selected === row ? "primary.light" : "white",
            color: selected === row ? "white" : null,
            "& .MuiLink-root": {
              color: selected === row ? "white" : undefined,
            },
          },
          className:
            row >= data.length ? "invisible" : "shadow-3 hover:bg-hoverPrimary",
        })}
        renderHooks={[
          ...[_pager ? null : pageData(controller.page, pageSize)].filter(
            Boolean
          ),
          addHeaderClass("first:pl-4 pr-2 last:pr-0 "),
          addClassToColumns(
            "first:pl-4 pr-4 pt-1 pb-1 first:rounded-l last:rounded-r"
          ),
          ...renderHooks,
        ]}
      />

      <div className="flex items-center mt-12">
        <Spacer />
        <Typography variant="body2" sx={{ mr: 4 }}>
          Total
        </Typography>
        <span className="text-disabled">
          <Await value={controller.count} />
        </span>
        <Spacer />
        <div className="print:hidden">
          <Pager controller={controller} />
        </div>
      </div>
    </TableWrapper>
  );
}

const ThemedBox = function ({
  title,
  headerButtons,
  children,
  selected,
  setSelected,
  ...props
}) {
  return (
    <TableContext.Provider value={[selected, setSelected]}>
      <Card1 boxClass="px-6 py-5" className="my-2 mx-2" {...props}>
        <TableHeader>
          <Typography variant="h5">{title}</Typography>
          {headerButtons}
        </TableHeader>
        {children}
      </Card1>
    </TableContext.Provider>
  );
};
export default ThemedTable;
