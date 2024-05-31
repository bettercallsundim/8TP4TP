export default function formatDate(timestamp) {
  const dates = new Date(parseInt(timestamp));
  const isoString = dates.toISOString();
  const date = new Date(isoString);

  // Get components
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();

  // Format day and month with leading zeros if necessary
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Determine AM/PM and format hours
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const formattedHours = hours < 10 ? `0${hours}` : hours;

  // Format minutes with leading zeros if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Combine into a readable format
  const formattedDate = `${formattedHours}:${formattedMinutes} ${ampm} , ${formattedMonth}/${formattedDay}/${year}`;

  return formattedDate;
}
