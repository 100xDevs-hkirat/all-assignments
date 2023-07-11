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
const port = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

var usersMaster = [];
app.use(express.json());

app.post("/signup", (req, res) => {
  var user = req.body;
  let userAlreadyExists = false;
  for (var i = 0; i < usersMaster.length; i++) {
    if (usersMaster[i].email === user.email) {
      userAlreadyExists = true;
      break;
    }
  }
  if (userAlreadyExists) {
    res.status(400).send("User Already Exist");
  } else {
    usersMaster.push(user);
    res.status(201).send("Signup successful");
  }
});

app.post("/login", (req, res) => {
  var user = req.body;
  let userFound = null;
  for (var i = 0; i < usersMaster.length; i++) {
    if (
      usersMaster[i].email === user.email &&
      usersMaster[i].password === user.password
    ) {
      userFound = usersMaster[i];
      break;
    }
  }

  if (Object.keys(userFound).length) {
    res.json({
      firstName: userFound.firstName,
      lastName: userFound.lastName,
      email: userFound.email,
    });
  } else {
    res.sendStatus(401);
  }
});

app.get("/data", (req, res) => {
  var email = req.headers.email;
  var password = req.headers.password;
  var userFound = false;
  for (var i = 0; i < usersMaster.length; i++) {
    if (
      usersMaster[i].email === email &&
      usersMaster[i].password === password
    ) {
      userFound = true;
      break;
    }
  }

  if (userFound === true) {
    let users = [];
    for (let i = 0; i < usersMaster.length; i++) {
      users.push({
        firstName: usersMaster[i].firstName,
        lastName: usersMaster[i].lastName,
        email: usersMaster[i].email,
      });
    }
    console.log(users);
    console.log({ users });
    res.status(200).send({ users });
  } else {
    res.sendStatus(401);
  }
});

app.all("*", (req, res) => {
  res.status(404);
});

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

module.exports = app;
