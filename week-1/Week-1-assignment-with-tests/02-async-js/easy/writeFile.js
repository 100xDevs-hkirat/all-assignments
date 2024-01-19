const fs = require("fs");
fs.writeFile("text.txt", "love you suni", "utf8", (err) => {
    if (err) {
        console.log(err);
        return;
    }
});
