const dateFormat = (inputDate) => {
  const date = new Date(inputDate);
  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate;
};

export default dateFormat;
