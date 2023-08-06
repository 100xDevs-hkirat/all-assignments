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
var USERS = [];
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const PORT = 3000;
const app = express();
app.use(express.json());
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

app.get("/", (req, res) => {
  return res.status(200).send("Heartbeat!");
});

app.post("/signup", (req, res) => {
  const email = req.body.email;
  for (let i = 0; i < USERS.length; i++) {
    if (email == USERS[i].email) {
      return res.status(400).send("Bad Request");
    }
  }
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const userId = uuidv4();

  USERS.push({
    email: email,
    password: password,
    firstName: firstName,
    lastName: lastName,
    userId: userId,
  });
  res.status(201).send("Signup successful");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  let userInd = -1;
  for (let i = 0; i < USERS.length; i++) {
    if (email === USERS[i].email) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(400).send("Bad Request");
  }
  const password = req.body.password;
  if (password !== USERS[userInd].password) {
    return res.status(401).send("Unauthorized");
  } else {
    const userData = {
      email: email,
      firstName: USERS[userInd].firstName,
      lastName: USERS[userInd].lastName,
    };
    return res.status(200).send(userData);
  }
});

app.get("/data", (req, res) => {
  const email = req.headers.email;
  let userInd = -1;
  for (let i = 0; i < USERS.length; i++) {
    if (email === USERS[i].email) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(400).send("Bad Request");
  }
  const password = req.headers.password;
  if (password !== USERS[userInd].password) {
    return res.status(401).send("Unauthorized");
  } else {
    const data = USERS.map((a) => {
      return {
        email: a.email,
        firstName: a.firstName,
        lastName: a.lastName,
        userId: a.userId,
      };
    });
    return res.status(200).send({ users: data });
  }
});

// app.listen(PORT, () => {
//   console.log(`Example app listening on port ${PORT}`);
// });

module.exports = app;
