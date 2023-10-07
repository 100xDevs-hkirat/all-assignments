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
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const PORT = 3000;
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(express.json());

var users = [];
var password = "";

const signup = (req, res) => {
  let userExist = false;
  for (let existingUser of users) {
    if (existingUser.username === req.body.username) {
      userExist = true;
    }
  }

  if (userExist) {
    // message and response status
    let message = req.body.username + " user already exist !";
    res.status(400).send(message);
  } else {
    const uid = uuidv4();
    const newUser = {
      id: uid,
      username: req.body.username,
      password: req.body.password,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    users.push(newUser);

    //! Importing the new Users data in json file
    const usersInJson = JSON.stringify(users, null, 2); // conversts the js array to json format

    fs.writeFile("users.json", usersInJson, "utf-8", (err) => {
      err
        ? console.error(" error writing json file")
        : console.log("JSON file has been saved!");
    });

    res.status(200).send(req.body.username + " registered succesfully");
  }
};

app.post("/signup", signup);

// ! LOGIN

const login = (req, res) => {
  const { username, password } = req.body;
  let userExist = false;
  for (let user of users) {
    if (user.username === username && user.password === password) {
      userExist = true;
      break;
    }
  }
  if (userExist) {
    res.send(JSON.stringify(req.body));
    console.log("user exists");
  } else {
    res.status(401).send("first register before logging in !");
  }
};

app.post("/login", login);

// ! GET DATA

const getData = (req, res) => {
  fs.readFile("users.json", (err, data) => {
    if (err) {
      console.error("error while reading users data");
      res.send("error while reading users data");
    }
    res.send(data);
  });
};

app.get("/data", getData);

// ! Delete the data from the json file

const deleteData = (req, res) => {
  fs.writeFile("users.json", "", (err) => {
    err
      ? console.log("error while emptying the users data")
      : res.send("Deleted the users data succesfully !");
  });
};

app.get("/delete", deleteData);

app.get("/", (req, res) => {
  res.send("Authentication Server Page !");
});

app.listen(PORT, () => {
  console.log("the app is listening");
});

module.exports = app;
