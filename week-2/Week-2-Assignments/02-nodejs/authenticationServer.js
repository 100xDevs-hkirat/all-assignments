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

  - For any other route not defind in the server return 404

  Testing the server - run `npm run test-authenticationServer` command in terminal
 */

const express = require("express");
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server

data = [];

//app.listen(3000);
app.use(bodyParser.json());

// Sign Up
app.post("/signup", (req, res) => {
    inputData = req.body;
    isAccountExists = false;
    for (var i = 0; i < data.length; i++) {
        if (inputData.username === data[i].username) {
            isAccountExists = true;
            break;
        }
    }
    if (isAccountExists) {
        res.status(401).send("username already exists");
    } else {
        uniqueId = data.length + 1;
        inputData.id = uniqueId;
        data.push(inputData);
        res.status(201).send("Signup successful");
    }
});

// Login In
app.post("/login", (req, res) => {
    inputData = req.body;
    uname = inputData.username;
    pword = inputData.password;
    email = inputData.email;
    accountPresent = false;
    output = {};
    for (var i = 0; i < data.length; i++) {
        if (
            uname == data[i].username &&
            pword == data[i].password &&
            email == data[i].email
        ) {
            accountPresent = true;
            output.id = data[i].id;
            output.firstName = data[i].firstName;
            output.lastName = data[i].lastName;
            output.email = data[i].email;
            break;
        }
    }
    if (!accountPresent) {
        res.status(401).send();
    } else {
        res.status(200).json(output);
    }
});

// getting all the info
app.get("/data", (req, res) => {
    pword = req.headers.password;
    email = req.headers.email;
    invalidPassOrEmail = false;
    if (pword == undefined || pword == "") {
        invalidPassOrEmail = true;
    }
    if (email == undefined || email == "") {
        invalidPassOrEmail = true;
    }
    if (invalidPassOrEmail) {
        res.status(401).send("Unauthorized");
    } else {
        accountPresent = false;
        console.log("pword");
        console.log(pword);
        console.log(email);
        for (var i = 0; i < data.length; i++) {
            if (pword === data[i].password && email === data[i].email) {
                accountPresent = true;
                break;
            }
        }
        if (!accountPresent) {
            res.status(401).send("Unauthorized");
        } else {
            output = [];
            for (var i = 0; i < data.length; i++) {
                output.push({
                    firstName: data[i].firstName,
                    lastName: data[i].lastName,
                    email: data[i].email,
                });
            }
            res.send({ users: output });
        }
    }
});

app.get("/alldata", (req, res) => {
    res.status(200).json(data);
});

module.exports = app;
