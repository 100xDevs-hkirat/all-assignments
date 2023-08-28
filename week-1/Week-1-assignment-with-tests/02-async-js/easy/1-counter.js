
var counter = 1;

function printcounter(){
  console.clear()
  console.log(counter);
  counter = counter + 1;

setTimeout(printcounter,1*1000);
}
setTimeout(printcounter,1*1000);