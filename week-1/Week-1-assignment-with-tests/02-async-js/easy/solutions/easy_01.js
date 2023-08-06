var counter = 0;


var ans = setInterval(function incCounter(){
    console.log(counter)
    counter++;

    if(counter==10){
        console.log(counter)
        clearInterval(ans)
    }
   
},1000)

console.log(ans)