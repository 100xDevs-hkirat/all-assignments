// this keeps increasing counter after each one second till stopped mannually
function counterIncrement() {
    let counter = 0;
    setInterval(() => {
        counter += 1;
        console.log(counter);
    }, 1000);
}

// counterIncrement()
//in this setTiimeout waits for 1 miliseconds decreases the value of n and then
//calls the counter function itself again.
function counter(n) {
    console.log(n)
    if (n > 0) {
        setTimeout(() => {
            counter(n - 1)
        }, 1000)
    }
}

counter(10)
