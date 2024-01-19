const fs = require("fs");

fs.readFile("cleaner.txt", "utf8", (err, data) => {
    if (err) {
        console.log("err while reading the file");
        return;
    } else {
        data = data;
        data = data.split(" ");
        result = [];
        data.map((item) => {
            if (item !== "") {
                result.push(item);
            }
        });
        result = result.join(" ")
        fs.writeFile('cleaner.txt', result, 'utf8', (err)=>{
            if (err){
                console.log('could not write the data' , err)
                return
            }else console.log("data written successfully")
        })
    }
});
