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

// const express = require("express")
import express from "express";
import body_parser from "body-parser";
import jwt from "jsonwebtoken";
const PORT = 3000;
const app = express();
app.use(body_parser.json());
app.use(express.json())
const jwt_secret = "dumy$ecREt";
var allUsersList = [];
var allAdminList = [{
  id: "132a456", username: "Admin", password: "Password", firstName: "firstName", lastName: "lastName"

}];
// app.use(express().)

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

///Generating token
function generateToken(data) {
  return jwt.sign(data, jwt_secret);
}

app.post("/signup", (req, res) => {
  const passwordNew = req.body.password;


  const { username, password, firstName, lastName } = req.body;

  if ((username && username.length === 0) || (password && password.length === 0) || (lastName && lastName.length === 0)) {
    res.status(400).send({ "statusCode": 0, "message": "One or More fields are empty" });
    return;
  }
  const newUser = {
    id: Date().valueOf(), name: username, password: password, firstName: firstName, lastName: lastName
  };
  allUsersList.push(newUser);
  res.status(200).send({ "statusCode": 1, "message": "Account successfully created", "userId": newUser.id, "token": generateToken(newUser) });
})

app.post("/login", (req, res) => {
  const { username, password } = req.body;


  if ((username && username.length === 0) || (password && password.length === 0)) {
    res.status(400).send({ "statusCode": 0, "message": "One or More fields are empty" });
    return;
  }
  var userDetails = allUsersList.find((singleUserDetails) => (singleUserDetails.name == username && singleUserDetails.password == password));

  console.log(userDetails);
  if (userDetails) {
    res.status(200).send({ "statusCode": 1, data: userDetails });

  } else {

    res.status(400).send({ "statusCode": 0, "message": "User Not Fould" });
  }
})

const adminAuth = (req, res, next) => {
  const { username, password } = req.headers;

  var isAdmin = allAdminList.find((ele) => (ele.username == username && ele.password == password)
  );
  if (isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

app.get("/data", adminAuth, (req, res) => {
  if (allUsersList.length > 0) {
    res.send({ "statusCode": 1, "data": allUsersList });
  } else {

    res.send({ "statusCode": 0, "message": "No User Record Found", });
  }
});

app.listen(3000, () => {
  console.log("server started at 3000")
})
// module.exports = app;
