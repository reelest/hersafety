import range from "@/utils/range";
import Template from "./Template";
import ThemedButton from "./ThemedButton";
import mergeProps from "@/utils/mergeProps";
import LoaderAnimation from "./LoaderAnimation";
import { useMemo, useRef, useState } from "react";
import uniq from "@/utils/uniq";

const borderSpacings = [
  "border-spacing-y-0",
  "border-spacing-y-1",
  "border-spacing-y-2",
  "border-spacing-y-3",
  "border-spacing-y-4",
  "border-spacing-y-5",
];
const renderColumn = ({ data, row, col, classes, attrs }) => {
  return row >= 0 ? (
    <td key={row + ";" + col} className={classes.join(" ")} {...attrs}>
      {Array.isArray(data) ? data[row][col] : data}
    </td>
  ) : (
    <th key={col} className={classes.join(" ")} {...attrs}>
      {Array.isArray(data) ? data[col] : data}
    </th>
  );
};

const callHooks = (
  _data,
  _row,
  _col,
  _classes,
  _attrs,
  [firstHook, ...renderHooks]
) => {
  return (firstHook || renderColumn)({
    data: _data,
    row: _row,
    col: _col,
    classes: _classes,
    attrs: _attrs,
    next: ({
      data = _data,
      row = _row,
      col = _col,
      classes = _classes,
      attrs = _attrs,
    } = {}) => callHooks(data, row, col, classes, attrs, renderHooks),
  });
};
export default function Table({
  data,
  rows = Array.isArray(data) ? data.length : 0,
  cols = Array.isArray(data?.[0]) ? data[0].length : 0,
  tableRef,
  loading = false,
  headers,
  scrollable,
  headerClass = "border-b text-left",
  bodyClass = "font-20 leading-relaxed",
  rowClass = "",
  rowSpacing = 0,
  onClickRow,
  className = "w-full leading",
  renderHooks = [],
}) {
  const table = (
    <table
      ref={tableRef}
      className={`${className} ${rowSpacing > 0 ? "border-separate" : ""} ${
        borderSpacings[rowSpacing]
      }`}
    >
      <thead className={headerClass}>
        <tr>
          {range(cols).map((col) =>
            callHooks(headers, -1, col, [], {}, renderHooks)
          )}
        </tr>
      </thead>
      <tbody className={bodyClass}>
        {loading ? (
          <tr>
            <td colSpan={100} className="w-full py-3">
              <LoaderAnimation small />
            </td>
          </tr>
        ) : (
          range(rows).map((row) => (
            <tr
              key={row}
              className={
                typeof rowClass === "function" ? rowClass(row) : rowClass
              }
              onClick={onClickRow ? (e) => onClickRow(e, row) : undefined}
            >
              {range(cols).map((j) =>
                callHooks(data, row, j, [], {}, renderHooks)
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
  if (scrollable)
    return <div className="max-w-full px-1 overflow-x-auto">{table}</div>;
  else return table;
}

export const TableHeader = (props) => (
  <Template props={props} className="flex justify-between mb-4" />
);
export const TableButton = (props) => (
  <Template
    props={props}
    as={ThemedButton}
    variant="text"
    color="text-secondary"
    className="flex items-baseline"
  />
);

/**Render Hooks */
export const addHeaderClass =
  (className) =>
  ({ row, classes, next }) =>
    row < 0 ? next({ classes: classes.concat(className) }) : next();
export const supplyHeader =
  (getHeader) =>
  ({ row, col, next }) =>
    row < 0 ? next({ data: getHeader(col) }) : next();
export const addClassToColumns =
  (className, columns = null) =>
  ({ row, col, classes, next }) =>
    row >= 0 && (!columns || columns.includes(col))
      ? next({ classes: classes.concat(className) })
      : next();
export const onClickHeader =
  (onClick, columns) =>
  ({ row, col, next, attrs }) =>
    row < 0 && (!columns || columns.includes(col))
      ? next({
          attrs: mergeProps(attrs, { onClick: (e) => onClick(e, col) }, [
            "onClick",
          ]),
        })
      : next();

/**
 *
 * @param {(row:number, col:number)=>any} getValue
 * @returns
 */
export const supplyValue =
  (getValue) =>
  ({ row, col, next }) =>
    row >= 0 ? next({ data: getValue(row, col) }) : next();

export const pageData =
  (currentPage, pageSize) =>
  ({ row, next }) =>
    row >= 0 ? next({ row: row + (currentPage - 1) * pageSize }) : next();
export const clipColumn =
  (column, widthClass = "w-56") =>
  ({ data, col, row, next }) =>
    row >= 0 && column === col
      ? next({
          data: (
            <span
              className={`inline-block align-bottom ${widthClass} whitespace-nowrap overflow-hidden text-ellipsis`}
            >
              {data}
            </span>
          ),
        })
      : next();
export const useColumnSelect = (
  data,
  select,
  column,
  emptyText = "No filter"
) => {
  const [active, setActive] = useState("all");
  select = useRef(select).current;
  const cols = useMemo(
    () => (data ? data.map(select).sort().filter(uniq) : []),
    [data, select]
  );
  const filtered = useMemo(
    () =>
      !data || active === "all"
        ? data
        : data.filter((e) => select(e) === cols[active]),
    [data, select, cols, active]
  );
  return [
    filtered,
    ({ row, col, next }) =>
      row < 0 && col === column
        ? next({
            data: (
              <select
                onChange={(e) => {
                  setActive(e.target.value ? Number(e.target.value) : "all");
                }}
                className="select-1"
              >
                {cols.map((e, i) => (
                  <option key={e} value={i}>
                    {e}
                  </option>
                ))}
                <option value="">{emptyText}</option>
              </select>
            ),
          })
        : next(),
  ];
};
