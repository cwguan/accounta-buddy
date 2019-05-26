// Gets time in HH:DD in correct format for database
function getCurrentTime() {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  // TODO: FIX, IT'S HACKY
  let checkInTime = localISOTime.slice(localISOTime.indexOf("T") + 1, localISOTime.indexOf(":") + 3);
  return checkInTime;
}


// Gets date in YYYY-MM-DD in correct format for database
function getCurrentDate() {
  let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

  // TODO: FIX, IT'S HACKY
  let checkInDate = localISOTime.slice(0, localISOTime.indexOf("T"));
  return checkInDate;
}
