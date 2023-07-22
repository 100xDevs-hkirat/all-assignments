const fs = require("fs");
fileData = "";
fs.readFile("data.txt", (err, data) => {
  if (err) throw err;
  else {
    fileData = data.toString();
    console.log(fileData);
    s_arr = "";
    for (var i = 0; i < fileData.length; i++) {
      if (fileData[i] == " " && s_arr[s_arr.length - 1] != " ") {
        s_arr = s_arr + " ";
      } else if (fileData[i] != " ") {
        s_arr = s_arr + fileData[i];
      }
      // console.log(s_arr);
    }
    fs.writeFile("data.txt", s_arr, (err) => {
      if (err) throw err;
      else {
        console.log("Done ");
      }
    });
  }
});
