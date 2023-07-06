let counter=0;

//counter 1 (with setInterval)
// function func1()
// {
//     console.clear();
//     console.log(counter);
//     counter+=1;
// }
// setInterval(func1,1000);


//counter 2 (with setTimeout)
function func2()
{
    console.clear();
    console.log(counter);
    counter+=1;
    setTimeout(func2,1000);
}
setTimeout(func2,1000);