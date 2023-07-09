function clock() {
  const date = new Date();
  const hour = date.getHours() + 2;
  const minute = date.getMinutes();
  const seconds = date.getSeconds();
  console.log(
    `${hour < 13 ? hour : hour - 12}:${minute}:${seconds} ${
      hour > 11 ? "PM" : "AM"
    }`
  );
}

setInterval(() => {
  clock();
}, 1000);
