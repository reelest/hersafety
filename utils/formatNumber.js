import { timeFormat } from "d3";

export function formatPhoneNumber(number_string) {
  const [failed, countryCode, ...parts] = String(number_string ?? "").split(
    /^(\+\d\d\d)?(\d\d\d)?(?:(\d\d\d)?(\d\d\d)?|(\d?\d\d\d)?(\d\d\d)?)(\d\d\d\d?)?$/
  );
  if (failed) return failed;
  return (
    (countryCode ? countryCode + " " : "") + parts.filter(Boolean).join("-")
  );
}

export function formatNumber(number_string) {
  const parts = String(number_string ?? "").split(
    /^(\d\d?)?(?:(\d\d\d)(?:(\d\d\d)(?:(\d\d\d)(?:(\d\d\d))?)?)?)?$/
  );
  return parts.filter(Boolean).join(",");
}

export const formatTime = timeFormat("%-I:%M%p");
export const formatDate = timeFormat("%e/%m/%Y");
