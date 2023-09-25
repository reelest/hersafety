import { UnimplementedError } from "@/models/lib/errors";
import {
  formatDate,
  formatPhoneNumber,
  formatTime,
} from "@/utils/formatNumber";
import { CloseCircle, TickCircle } from "iconsax-react";
import { supplyValue } from "./Table";
import Await from "./Await";
import sentenceCase from "@/utils/sentenceCase";
import { Link } from "@mui/material";
import ModelItemPreview from "./ModelItemPreview";

/**
 * @param {Object} param0
 * @param {String} param0.name
 * @param {import("@/models/lib/model_type_info").Item} param0.item
 */
export default function ModelDataView({ name, item }) {
  const meta = item.model().Meta[name];
  let value = item[name];
  switch (meta.type) {
    case "string":
      switch (meta.stringType) {
        case "email":
          return value && <Link href={"email:" + value}>{value}</Link>;
        case "tel":
          return (
            value && (
              <Link href={"tel:" + value} className="whitespace-nowrap">
                {formatPhoneNumber(value)}
              </Link>
            )
          );
        case "url":
          return (
            value && (
              <Link href={value} rel="noopener">
                {value}
              </Link>
            )
          );
        case "longtext":
          value = value.length > 33 ? value.substring(0, 30) + "..." : value;
          break;
      }
      return value;
    case "number":
      return value;
    case "boolean":
      return (
        <div className="text-center">
          {value ? <TickCircle color="green" /> : <CloseCircle color="red" />}
        </div>
      );
    case "date":
      return formatDate(value);
    case "datetime":
      return (
        <span className="whitespace-nowrap">
          {formatDate(value) + " " + formatTime(value)}
        </span>
      );
    case "time":
      return formatTime(value);
    case "file":
      return value ? (
        <Link href={value} rel="noopener">
          Download
        </Link>
      ) : null;
    case "ref":
      return value ? (
        <ModelItemPreview item={meta.refModel.item(value)} />
      ) : undefined;
    case "object":
    case "image":
    case "array":
    case "map":
      throw new UnimplementedError(
        "Unimplemented type = " + meta.type + " for ModelDataView"
      );
  }
}
const _get = (x) => {
  return "get" + sentenceCase(x);
};
export function supplyModelValues(props) {
  return supplyValue((row, col, items) => {
    if (items?.[row] && props[col] in items[row]) {
      return <ModelDataView item={items[row]} name={props[col]} />;
    } else if (items?.[row] && _get(props[col]) in items[row]) {
      return <Await value={items[row][_get(props[col])]()} />;
    } else return items;
  });
}
