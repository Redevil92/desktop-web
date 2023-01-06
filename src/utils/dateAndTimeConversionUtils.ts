export const formatDate = (date: Date, format: string) => {
  const day = date.getDay() + 1 < 10 ? "0" + (date.getDay() + 1).toString() : (date.getDay() + 1).toString();
  const month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
  const year = date.getFullYear().toString();
  return format.replace("DD", day).replace("MM", month).replace("YYYY", year);
};

export const formatStringDate = (stringDate: string, format: string) => {
  const date = new Date(stringDate);
  return formatDate(date, format);
};

export const formatTimeFromDate = (date: Date, format: string) => {
  const isHour12 = format.includes("XM");

  const seconds = date.getSeconds() < 10 ? "0" + date.getSeconds().toString() : date.getSeconds().toString();
  const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes().toString() : date.getMinutes().toString();

  let hours = date.getHours();
  let ampm = "";
  if (isHour12) {
    ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
  }

  return format.replace("HH", hours.toString()).replace("MM", minutes).replace("SS", seconds).replace("XM", ampm);
};

export const formatTimeFromStringDate = (stringDate: string, format: string) => {
  const date = new Date(stringDate);
  return formatTimeFromDate(date, format);
};
