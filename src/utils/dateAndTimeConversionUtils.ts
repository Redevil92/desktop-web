export const formatStringDate = (stringDate: string, format: string) => {
  const date = new Date(stringDate);

  const day = date.getDay() < 10 ? "0" + date.getDay().toString() : date.getDay().toString();
  const month = date.getMonth() < 10 ? "0" + date.getMonth().toString() : date.getMonth().toString();
  const year = date.getFullYear().toString();

  return format.replace("DD", day).replace("MM", month).replace("YYYY", year);
};

export const formatTimeFromStringDate = (stringDate: string, format: string) => {
  const date = new Date(stringDate);

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
