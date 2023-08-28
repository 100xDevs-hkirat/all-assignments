const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.get("/file/:filename", (req, res) =>{ // /file/:fiename : are also a way of sending the data tot he backend.
  const fileName = req.params.filename;// Get the filename from the URL parameter
  const filePath = path.join(__dirname, "./files", fileName); // Construct the file path using path.join
// https:www.instagram.com/user/hafeez
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      res.status(404).send("Cannot Read the file " + filePath);
      return;
    }
    res.send(data);
  });
});

app.get("/files", (req, res) => {
  fs.readdir("./files", (err, files) => {
    if (err) {
      res.send(500).send(" ERROR while getting the files names");
    }
    res.json(files);
  });
});

// app.listen(3000, () => {
//   console.log("listeing you dear !!!");
// });

module.exports = app;