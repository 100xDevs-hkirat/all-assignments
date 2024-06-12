const fs = require('fs');
let data = "writing into the file....";
function afterUpdate(err) {
    if (err) {
        console.log(err);
        return;
    }
    console.log("File has been written");
}
fs.writeFile('./test.txt', data, 'utf8', afterUpdate);

