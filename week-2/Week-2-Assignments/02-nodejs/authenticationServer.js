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

const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const users = [];
app.post("/signup", (req, res) => {
  const userIndex = users.findIndex((user) => user.email === req.body.email);
  console.log(users);
  if (userIndex == -1) {
    const newUser = {
      id: Math.floor(Math.random() * 10000),
      email: req.body.email,
      password: req.body.password,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    };
    users.push(newUser);
    res.status(201).send("Signup successful");
  } else res.status(400).send("Username already exists");
});
app.post("/login", (req, res) => {
  const userIndex = users.findIndex(
    (user) =>
      user.email === req.body.email && user.password === req.body.password
  );
  if (userIndex < 0) res.status(401).send("Unauthorized");
  else {
    const responseObj = {
      id: users[userIndex].id,
      email: users[userIndex].email,
      firstName: users[userIndex].firstName,
      lastName: users[userIndex].lastName,
    };
    res.status(200).json(responseObj);
  }
});
app.get("/data", (req, res) => {
  const userIndex = users.findIndex((user) => {
    return (
      user.email === req.headers.email && user.password === req.headers.password
    );
  });
  if (userIndex < 0) res.status(401).send("Unauthorized");
  else {
    const responseArrObj = { users: [] };
    users.forEach((user) => {
      const responseObj = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
      };
      responseArrObj.users.push(responseObj);
    });
    res.status(200).json(responseArrObj);
  }
});
app.use((req, res, next) => res.status(404).send("Route not found"));
// app.listen(PORT, () => console.log(`App started at port ${PORT}`));
module.exports = app;
