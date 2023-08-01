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
const fs = require('fs').promises;
const path = require('path');
const app = express();

const readDirAsync = async () => {
  return new Promise((resolve, reject) => {
    fs.readdir(path.join(__dirname, './files'), 'utf-8')
      .then((files) => resolve(files))
      .catch((err) => reject(err));
  });
};

const readFileAsync = async (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, '/files', filename), 'utf-8')
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

app.get('/files', async (req, res) => {
  try {
    const files = await readDirAsync();
    res.send(files);
  } catch (err) {
    res.sendStatus(500);
  }
});

app.get('/files/:filename', async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { filename } = req.params;
  try {
    const files = await readFileAsync(filename);
    res.status(200).send(files);
  } catch (err) {
    res.status(404).json('File Not found.');
  }
});

app.get('*', (req, res) => {
  res.status(404).send('Route not found');
});

module.exports = app;
