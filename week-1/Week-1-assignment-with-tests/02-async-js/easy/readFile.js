const fs = require("fs");

fs.readFile("text.txt", "utf8", (err, data) => {
    if (err) {
        console.log(err);
        return;
    }else{
        console.log(data)
    }
});
counter = 0
for (let i = 0; i < 100000000; i++){
   counter = counter+1 
}
console.log(counter)
