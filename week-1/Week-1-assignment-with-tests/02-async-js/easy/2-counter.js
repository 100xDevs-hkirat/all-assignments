let i = 0;

function counter() {
  console.log(i);
  i++;
  setTimeout(counter, 1000);
}

counter(); 
