/*
Using `1-counter.md` or `2-counter.md` from the easy section, can you create a
clock that shows you the current machine time?

Can you make it so that it updates every second, and shows time in the following formats - 

 - HH:MM::SS (Eg. 13:45:23)

 - HH:MM::SS AM/PM (Eg 01:45:23 PM)
*/

function clock1() {
  const date = new Date();
  const HH = date.getHours().toString().padStart(2, '0');
  const MM = date.getMinutes().toString().padStart(2, '0');
  const SS = date.getSeconds().toString().padStart(2, '0');

  console.clear();
  console.log(`${HH}:${MM}:${SS}`);
}

function clock2() {
  const date = new Date();
  const HH =
    date.getHours() <= 12
      ? date.getHours().toString().padStart(2, '0')
      : (date.getHours() - 12).toString().padStart(2, '0');
  const MM = date.getMinutes().toString().padStart(2, '0');
  const SS = date.getSeconds().toString().padStart(2, '0');
  const AMPM = date.getHours() <= 12 ? 'AM' : 'PM';
  console.clear();
  console.log(`${HH}:${MM}:${SS} ${AMPM}`);
}
setInterval(clock2, 1000);
