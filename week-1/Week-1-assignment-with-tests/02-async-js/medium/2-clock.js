const getDate = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  return new Date(now.getTime() + istOffset);
};

setInterval(() => {
  const date = getDate();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const isPM = hours > 11;
  console.log(
    `${hours > 12 ? hours - 12 : hours}:${minutes}:${seconds} ${
      isPM ? "PM" : "AM"
    }`
  );
}, 1000);
