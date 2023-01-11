export const humanDate = (d: Date) =>
  d.toLocaleTimeString("en-us", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "longGeneric",
  });
