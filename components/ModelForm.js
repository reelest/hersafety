import { noop } from "@/utils/none";
import {
  Box,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Form, { FormField } from "./Form";
const FORM_SECTION = "!modelform-section";
export default function ModelForm({ model, item }) {
  const sections = { DEFAULT: [] };
  Object.keys(model.Meta).forEach((e) => {
    let section = sections.DEFAULT;
    if (model.Meta[e][FORM_SECTION]) {
      section =
        sections[model.Meta[e][FORM_SECTION]] ||
        (sections[model.Meta[e][FORM_SECTION]] = []);
    }
    if (e[0] === "!") return;
    section.push(e);
  });
  return (
    <Form>
      {Object.keys(sections).map((e) => (
        <>
          {e === "DEFAULT" ? null : e}
          {sections[e].map((e) => createFormField(e, model.Meta[e]))}
        </>
      ))}
    </Form>
  );
}
/** @type {Array<import("@/models/model_type_info").StringType>} */
const INPUT_TYPES = ["email", "password", "tel", "url"];
/** @type {Record<, string} */

/** @param {import("@/models/model_type_info").ModelPropInfo} meta*/
function collectInputProps(meta) {
  return Object.keys(meta).reduce((acc, _key) => {
    /** @type {keyof import("@/models/model_type_info").ModelPropInfo}*/
    let key = _key;
    let value = meta[key];
    if (value === undefined) return acc;
    switch (key) {
      case "required":
      case "label":
      case "minLength":
      case "maxLength":
        break;
      case "pattern":
        value = value.raw;
        break;
      case "minValue":
        key = "min";
        break;
      case "maxValue":
        key = "max";
        break;
      case "type":
        value =
          value === "string"
            ? INPUT_TYPES.includes(meta.stringType)
              ? meta.stringType
              : "text"
            : value;
        break;
      default:
        return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
}
/**
 *
 * @param {string} key
 * @param {import("@/models/model_type_info").ModelPropInfo} meta
 */
function createFormField(key, meta) {
  switch (meta.type) {
    case "hidden":
      return null;
    case "string":
    case "number":
      return (
        <FormField
          multiline={meta.stringType === "longtext"}
          name={key}
          key={key}
          {...collectInputProps(meta)}
        />
      );
    case "boolean":
      return (
        <FormField
          {...meta}
          type="checkbox"
          name={key}
          key={key}
          label={meta.label}
        />
      );
    default:
      throw new Error("Unhandled Input type " + meta.type);
  }
}
