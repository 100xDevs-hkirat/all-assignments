function counter() {
  var today = new Date();
  console.log(today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds());
  
  setTimeout(() => {
    counter();
  }, 1000);
}

counter();