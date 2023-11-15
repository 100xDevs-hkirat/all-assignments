var c = 0;
function count(){
    console.clear();
    console.log(c);
    c+=1;
    setTimeout(count , 1000);
}
setTimeout(count , 1000);
