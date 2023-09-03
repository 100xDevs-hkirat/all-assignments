// Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
// clock that shows you the current machine time?

// Can you make it so that it updates every second, and shows time in the following formats -

//  - HH:MM::SS (Eg. 13:45:23)

//  - HH:MM::SS AM/PM (Eg 01:45:23 PM)

const dt = new Date();
let localHour = dt.getHours();
let localMinute = dt.getMinutes();
let localSecond = dt.getSeconds();

function updateTime() {
  console.clear();

  console.log(
    `Local Time: 
    ${localHour.toString().padStart(2, 0)}:${localMinute
      .toString()
      .padStart(2, 0)}::${localSecond.toString().padStart(2, 0)}`
  );

  console.log(indianTime(localHour, localMinute, localSecond));

  if (localSecond > 58) {
    localMinute++;
    localSecond = 0;
  }

  if (localMinute > 58) {
    localHour++;
    localMinute = 0;
  }

  if (localHour > 24) {
    localHour = 0;
  }

  localSecond++;
}

function indianTime(localHour, localMinute, localSecond) {
  let str = "AM";
  if (localHour > 12) {
    localHour = localHour - 12;
    str = "PM";
  }

  return `Indian Time: 
    ${localHour.toString().padStart(2, 0)}:${localMinute
    .toString()
    .padStart(2, 0)}::${localSecond.toString().padStart(2, 0)}  ${str}`;
}

setInterval(updateTime, 1000);
