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
import { Typography } from "@mui/material";

function ThemedTable({
  container: TableWrapper = ThemedBox,
  results,
  headers,
  renderHooks = [],
  selected,
  setSelected,
  ...props
}) {
  const { data, ...controller } = usePager(results || [], 10);
  return (
    <TableWrapper {...props}>
      <Table
        loading={!results}
        data={results}
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
        onClickRow={
          setSelected
            ? (e, row) => setSelected(selected === row ? -1 : row)
            : null
        }
        renderHooks={[
          pageData(controller.page, 10),
          addHeaderClass("first:pl-4 pr-2 last:pr-0 font-20t"),
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
        <span className="font-20t text-disabled">{results?.length}</span>
        <Spacer />
        <Pager controller={controller} />
      </div>
    </TableWrapper>
  );
}

const ThemedBox = function ({ title, headerButtons, children, ...props }) {
  return (
    <Card1 boxClass="px-6 py-5" className="my-2 mx-2" {...props}>
      <TableHeader>
        <Typography variant="h5">{title}</Typography>
        {headerButtons}
      </TableHeader>
      {children}
    </Card1>
  );
};
export default ThemedTable;
