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
const jwt = require("jsonwebtoken");

const app = express();
app.use(bodyParser.json());
const secretKey = "d@_s3kr3t_k3y";

const USERS = [];

app.post("/signup", (req, res) => {
  const newUser = req.body;
  console.log(newUser);
  if (newUser) {
    const existingUser = USERS.find(
      (user) => user.username === newUser.username
    );
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const id = Math.floor(1000000 * Math.random());
    USERS.push({
      id,
      username: newUser.username,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      password: newUser.password,
    });

    return res.status(201).send("Created");
  } else {
    return res.status(400).send("Bad Request");
  }
});

app.post("/login", (req, res) => {
  const user = req.body;
  const foundUser = USERS.find(
    (u) => u.username === user.username && u.password === user.password
  );

  if (foundUser) {
    const token = jwt.sign({ username: foundUser.username }, secretKey, {
      expiresIn: "1h",
    });
    return res.status(200).json({ token });
  } else {
    return res.status(401).send("Unauthorized");
  }
});

app.get("/data", (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  let userFound = false;

  for (let i = 0; i < USERS.length; i++) {
    if (USERS[i].username === username && USERS[i].password === password) {
      userFound = true;
      break;
    }
  }

  if (userFound) {
    let result = [];
    for (let i = 0; i < USERS.length; i++) {
      result.push({
        firstName: USERS[i].firstname,
        lastName: USERS[i].lastname,
        username: USERS[i].username,
      });
    }
    res.json(result).status(200).send("OK");
  } else res.send("Unauthorized").status(404);
});

app.use((req, res) => {
  return res.status(404).send("Not Found");
});

module.exports = app;
