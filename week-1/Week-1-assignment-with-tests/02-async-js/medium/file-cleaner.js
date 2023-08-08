const fs = require("fs");

fs.readFile("file-1.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading file:", err);
    return;
  }

  const cleanedData = cleanData(data);

  fs.writeFile("file-1.txt", cleanedData, "utf8", (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return;
    }

    console.log("File written!");
  });
});

const cleanData = (data) => {
  let cleanedData = data.replace(/\s+/g, " ").trim();
  return cleanedData;
};
