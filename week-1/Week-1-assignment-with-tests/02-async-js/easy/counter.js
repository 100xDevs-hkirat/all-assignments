let c = 0
function counter(){
        console.log(c++)
        if(c < 10){
            setTimeout(counter, 1000)
        }
    }



setTimeout(counter,1000)
