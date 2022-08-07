export const datesValidation = (fromDate, toDate) => {
  let selectedfromDate = fromDate.replace(/-/g, "/");
  let selectedtoDate = toDate.replace(/-/g, "/");
  const currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "/");

  if (selectedfromDate > currentDate || selectedtoDate > currentDate) {
    alert("Invalid Dates Selection (future date detected) ");
    return false;
  }

  if (selectedtoDate < selectedfromDate) {
    alert("End date must be equal or greater than start date");
    return false;
  }

  return [selectedfromDate, selectedtoDate];
};
