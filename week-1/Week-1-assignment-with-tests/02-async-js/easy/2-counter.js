//Counter without setInterval

var count=1;
function counter(){
    console.clear();
    console.log(count);
    count++;
}

for(var i=0;i<100;i++){
    setTimeout(counter, (i+1)*1000);
}