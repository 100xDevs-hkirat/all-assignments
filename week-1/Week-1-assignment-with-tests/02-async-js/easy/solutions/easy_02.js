var counter = 0;
function incCounter(){
    console.log(counter)
    counter++;
    setTimeout(incCounter,1000) //so basically this is recursion type 
    //it'll can setTimeout function again it will come back again to setTimeout then it will again call it will go on
}

incCounter()
