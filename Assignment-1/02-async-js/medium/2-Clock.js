function digit(num){
    if(num>12)return num%12;
}
function func() {
    console.clear();
    var curr = new Date();
    var h = curr.getHours();
    var m = curr.getMinutes();
    var s = curr.getSeconds();
    h=digit(h);
    console.log(h + " : " + m + " : " + s);
}

setInterval(func, 1000);

