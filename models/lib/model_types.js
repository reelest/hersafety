import COUNTRIES from "@/assets/countries.json";

export const Gender = {
  options: ["male", "female"],
};

export const HiddenField = {
  hidden: true,
};
export const HiddenTime = {
  hidden: true,
  type: "datetime",
};

export const Country = {
  options: COUNTRIES.map((e) => ({
    value: e.countryCode,
    label: e.countryNameEn,
  })).sort((a, b) => String(a.label).localeCompare(b.label)),
};
