const currentTime = new Date();

const updateTime = () => {
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes().toString().padStart(2, "0");
  const second = currentTime.getSeconds().toString().padStart(2, "0");

  const hour12Format = (hour % 12 || 12).toString().padStart(2, "0");
  const hour24Format = hour.toString().padStart(2, "0");
  const amOrPm = hour < 12 ? "AM" : "PM";

  console.clear();
  console.log(`${hour24Format}:${minute}:${second}`);
  console.log(`${hour12Format}:${minute}:${second} ${amOrPm}`);
  currentTime.setSeconds(currentTime.getSeconds() + 1);
  setTimeout(updateTime, 1000);
};

updateTime();
