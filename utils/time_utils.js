export const daysToSeconds = (days) => days * hoursToSeconds(24);
export const hoursToSeconds = (hours) => hours * minutesToSeconds(60);
export const minutesToSeconds = (mins) => 60 * mins;
export const daysToMs = (days) => 1000 * daysToSeconds(days);
export const hoursToMs = (hrs) => 1000 * hoursToSeconds(hrs);
export const minutesToMs = (mins) => 1000 * minutesToSeconds(mins);
