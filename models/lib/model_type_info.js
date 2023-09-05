import { None } from "@/utils/none";
import sentenceCase from "@/utils/sentenceCase";

/**
 * @typedef {("string"|"number"|"date"|"datetime"|"time"|"file"|"image"|"hidden"|"boolean"|"array"|"object")} ModelPropType
 * @typedef {("email"|"tel"|"password"|"address"|"text"|"url"|"longtext")} StringType
 *
 * @typedef {{
 *    type: ModelPropType,
 *    required?: boolean,
 *    minLength: number,
 *    maxLength: number,
 *    minValue: number,
 *    maxValue: number,
 *    options?: Array<{value: string, label: string}>,
 *    pattern?: RegexExp,
 *    stringType?: StringType,
 *    objectType?: ModelTypeInfo,
 *    arrayType?: ModelPropInfo,
 *    itemQuery?: import("./query").QueryCursor,
 *    label: string,
 *  }} ModelPropInfo

 * @typedef {{
 *  [prop: string]: ModelPropInfo
 * }} ModelTypeInfo
 */
function inferType(value, key) {
  const m =
    value === null ? null : Array.isArray(value) ? "array" : typeof value;
  switch (m) {
    case "boolean":
    case "number":
    case "string":
    case "array":
    case "object":
      return m;
    default:
      throw Error("Failed to infer prop type for " + key + " value: " + value);
  }
}

/**
 *
 * @param {string} key
 * @param {Item} template
 * @param {Partial<ModelPropInfo>} Meta
 * @param {string} path
 * @returns {ModelPropInfo}
 */
function _getModelPropInfo(key, template, Meta, path) {
  const type = Meta.type || inferType(template, path);

  return {
    ...Meta,
    type,
    required: Meta.required ?? true,
    minLength: Meta.minLength ?? 0,
    maxLength: Meta.maxLength ?? Number.MAX_SAFE_INTEGER,
    minValue: Meta.minValue ?? 0,
    maxValue: Meta.maxLength ?? Number.MAX_SAFE_INTEGER,
    options: Meta.options
      ? Meta.options.length === 0 || isObject(Meta.options[0])
        ? Meta.options
        : Meta.options.map((e) =>
            isObject(e) ? e : { value: e, label: sentenceCase(String(e)) }
          )
      : undefined,
    pattern: Meta.pattern,
    stringType: type === "string" ? Meta.stringType ?? "text" : undefined,
    objectType:
      type === "object"
        ? _getModelTypeInfo(template, Meta.objectType, path)
        : undefined,
    arrayType:
      type === "array"
        ? _getModelPropInfo("$i", template?.[0], Meta.arrayType, path + "[]")
        : undefined,
    itemQuery: Meta.itemQuery,
    label: Meta.label ?? sentenceCase(key.replace(/([a-z])([A-Z])/g, "$1 $2")),
  };
}

function isObject(e) {
  return e && typeof e === "object";
}

function _getModelTypeInfo(template, meta, path) {
  const propNames = template ? Object.keys(template) : [];
  if (meta) {
    propNames.push(...Object.keys(meta).filter((e) => !propNames.includes(e)));
  }

  return propNames.reduce((acc, key) => {
    /** @type {Partial<ModelPropInfo>} */
    acc[key] =
      key[0] === "!"
        ? meta[key]
        : _getModelPropInfo(
            key,
            template?.[key],
            meta?.[key] || None,
            path + "." + key
          );
    return acc;
  }, {});
}

/**
 *
 * @param {import("./lib/model").Model} Model
 * @returns {ModelTypeInfo}
 */
export default function getModelTypeInfo(Model, meta) {
  return _getModelTypeInfo(Model.create(), meta, Model._ref.path + "[]");
}
