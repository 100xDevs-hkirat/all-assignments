const fs = require("fs");
const path = require("path");

const removeExtraSpaces = (str) => {
  const strArr = str.split(" ");
  return strArr.filter((a) => a !== "").join(" ");
};

const readFile = async (fileName) => {
  const filePath = path.join(__dirname, fileName);

  const fileText = await new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        reject();
      } else {
        resolve(data);
      }
    });
  });

  const fixedStr = removeExtraSpaces(fileText);

  fs.writeFile(filePath, fixedStr, function (err) {
    if (err) throw err;
    console.log("Replaced: " + fixedStr);
  });
};

readFile("newTextFile.txt");
