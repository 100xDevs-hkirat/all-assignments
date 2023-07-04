/**
  You need to create an express HTTP server in Node.js which will handle the logic of a file server.
  - Use built in Node.js `fs` module

  The expected API endpoints are defined below,
  1. GET /files - Returns a list of files present in `./files/` directory
    Response: 200 OK with an array of file names in JSON format.
    Example: GET http://localhost:3000/files

  2. GET /file/:filename - Returns content of given file by name
     Description: Use the filename from the request path parameter to read the file from `./files/` directory
     Response: 200 OK with the file content as the response body if found, or 404 Not Found if not found. Should return `File not found` as text if file is not found
     Example: GET http://localhost:3000/file/example.txt

    - For any other route not defined in the server return 404

    Testing the server - run `npm run test-fileServer` command in terminal
 */
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

// Allow cross-origin requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.get('/files', (req, res) => {
  const files = fs.readdirSync('./files/');
  res.status(200).json({status:true, files:files});
});

app.listen(3000, () => {
  console.log('File server listening on port 3000');
});

app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile('./files/'+filename, "utf8", (err, data) => {
    if (err) 
      res.status(404).json({status:false, message:'File not found'});
    else
      res.json({status:true, data:data});
  });
});

app.get('*', (req, res) => {
  res.status(404).json({status:false, message:'Invalid route'});
});

module.exports = app;
