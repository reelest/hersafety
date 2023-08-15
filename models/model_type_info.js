import { None } from "@/utils/none";
import sentenceCase from "@/utils/sentenceCase";

/**
 * @typedef {("string"|"number"|"date"|"datetime"|"time"|"file"|"hidden"|"boolean"|"array"|"object")} ModelPropType
 * @typedef {("email"|"tel"|"password"|"address"|"text"|"url"|"longtext")} StringType
 *
 * @typedef {{
 *    type: ModelPropType,
 *    required?: boolean,
 *    minLength: number,
 *    maxLength: number,
 *    minValue: number,
 *    maxValue: number,
 *    options?: Array<any>,
 *    pattern?: RegexExp,
 *    stringType?: StringType,
 *    objectType?: ModelTypeInfo,
 *    arrayType?: ModelPropInfo,
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
      throw Error("Failed to infer prop type for " + key);
  }
}

function _getModelPropInfo(key, template, Meta, path) {
  const type = Meta.type || inferType(template, path);

  return {
    type,
    required: Meta.type ?? true,
    minLength: Meta.minLength ?? 0,
    maxLength: Meta.maxLength ?? Number.MAX_SAFE_INTEGER,
    minValue: Meta.minValue ?? 0,
    maxValue: Meta.maxLength ?? Number.MAX_SAFE_INTEGER,
    options: Meta.options,
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
    label: Meta.label ?? sentenceCase(key.replace(/[A-Z]/g, " $&")),
  };
}

/**
 *
 * @param {import("./model").Model} Model
 * @returns {ModelTypeInfo}
 */
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

export default function getModelTypeInfo(Model, meta) {
  return _getModelTypeInfo(Model.create(), meta, Model._ref.path + "[]");
}
