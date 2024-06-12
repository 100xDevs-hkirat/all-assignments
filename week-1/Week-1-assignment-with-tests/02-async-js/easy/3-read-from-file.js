const fs = require('fs');
function printFile(err, data) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(data);
}
fs.readFile('./test.txt', 'utf8', printFile);
var cnt = 0;
for (var i = 0; i < 1000000000; i++) {
    cnt++;
}