function displayClock() {
  const now = new Date().toLocaleTimeString("en-US", { hour12: true });
  console.clear();
  console.log(now);
}

setInterval(displayClock, 1000);
