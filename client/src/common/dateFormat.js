const dateFormat = (inputDate) => {
  const date = new Date(inputDate);

  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();

  // Format the date as "Month Day, Year"
  return `${month} ${day}, ${year}`;
};

export default dateFormat;
