var counter = 1;

function counterSolve() {
    console.clear();
    console.log(counter);
    counter++;
    setTimeout(counterSolve, 1000);
}

setTimeout(counterSolve, 1000);
