//Counter without setInterval

var count=1;
function counter(){
    console.clear();
    console.log(count);
    count++;
    setTimeout(counter,1000);
}
setTimeout(counter,1000);