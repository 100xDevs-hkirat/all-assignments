/**
  You need to create a HTTP server in Node.js which will handle the logic of an authentication server.
  - Don't need to use any database to store the data.

  - Save the users and their signup/login data in an array in a variable
  - You can store the passwords in plain text (as is) in the variable for now

  The expected API endpoints are defined below,
  1. POST /signup - User Signup
    Description: Allows users to create an account. This should be stored in an array on the server, and a unique id should be generated for every new user that is added.
    Request Body: JSON object with username, password, firstName and lastName fields.
    Response: 201 Created if successful, or 400 Bad Request if the username already exists.
    Example: POST http://localhost:3000/signup

  2. POST /login - User Login
    Description: Gets user back their details like firstname, lastname and id
    Request Body: JSON object with username and password fields.
    Response: 200 OK with an authentication token in JSON format if successful, or 401 Unauthorized if the credentials are invalid.
    Example: POST http://localhost:3000/login

  3. GET /data - Fetch all user's names and ids from the server (Protected route)
    Description: Gets details of all users like firstname, lastname and id in an array format. Returned object should have a key called users which contains the list of all users with their email/firstname/lastname.
    The users username and password should be fetched from the headers and checked before the array is returned
    Response: 200 OK with the protected data in JSON format if the username and password in headers are valid, or 401 Unauthorized if the username and password are missing or invalid.
    Example: GET http://localhost:3000/data

  - For any other route not defined in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const bodyParser = require("body-parser");
const PORT = 3000;
const app = express();
app.use(bodyParser.json());

const list = [];

const generateNewId = (list) => {
  let maxId = 0;

  list.forEach((item) => {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });

  return maxId + 1;
};

const generateAuthToken = (length = 16) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    token += chars.charAt(randomIndex);
  }

  return token;
};

app.post("/signup", (req, res) => {
  const newItem = req.body;
  const { username, password, firstName } = newItem;

  if (!username || !password || !firstName) {
    return res
      .status(404)
      .send({ error: "username & password & first name mandatory" });
  }

  const foundIndex = list.findIndex((x) => x.username === username);

  if (foundIndex !== -1) {
    return res.status(400).send({ error: "username already exists" });
  }

  list.push({ ...newItem, id: generateNewId(list) });
  res.status(201).send(list);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(404).send({ error: "username & password mandatory" });
  }

  const foundIndex = list.findIndex(
    (x) => x.username === username && x.password === password
  );

  if (foundIndex === -1) {
    return res.status(401).send({ error: "credentials are invalid" });
  }

  res.send({ authToken: generateAuthToken() });
});

app.get("/data", (req, res) => {
  const { username, password } = req.headers;

  const foundIndex = list.findIndex(
    (x) => x.username === username && x.password === password
  );

  if (foundIndex === -1) {
    return res.status(401).send({ error: "credentials are invalid" });
  }

  restList = list.map(({ username, password, ...restList }) => restList);

  res.send({ users: restList });
});

app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

app.listen(PORT, console.log("listening on 3000"));

module.exports = app;
