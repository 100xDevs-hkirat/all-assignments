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

const e = require("express");
const express = require("express")
const PORT = 3000;
const app = express();
const bodyParser = require("body-parser");
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.urlencoded({extended: true}));

let users = [];

app.post("/signup", (req, res) => {
  
  if(users.length == 0){
    let obj = {
      id: Math.floor((Math.random() * 10000) +1),
      username: req.body.username,
      password: req.body.password,  
      firstName: req.body.firstName,
      lastName: req.body.lastName,
    }
    users.push(obj);
    res.status(201).send("Successfully Created");
  }else{
    let verify = users.findIndex((value) => {
      return (value.username === req.body.username);
    })
    if(verify !== -1){
      res.status(400).send("Bad request, Username already exist");
    }
    else{
      let obj = {
        id: Math.floor((Math.random() * 10000) +1),
        username: req.body.username,
        password: req.body.password,  
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      }
      users.push(obj);
      res.status(201).send("Successfully Created");
    }
  }
})

app.post("/login", (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let userOne = users.find((value) => {
    return (value.username === username);
  })
  if(userOne){
    if(userOne.password === password){
      let obj = {
        id: userOne.id,
        firstName: userOne.firstName,
        lastName: userOne.lastName
      }
      res.status(200).send(obj);
    }
    else{
      res.status(401).send("Password is wrong");
    }
  }
  else{
      res.status(401).send("Username is invalid");
  }

})

app.get("/data", (req, res) => {
  
  let username = req.headers.username;
  let password = req.headers.password;

  let userOne = users.find((value) => {
    return (value.username === username);
  })
  if(userOne){
    if(userOne.password === password){
      
      let obj = {
        users: users.map((value) => {
          return {
            firstName: value.firstName,
            username: value.username,
            lastName: value.lastName
          }
        })
      };

      res.status(200).send(obj);
    }
    else{
      res.status(401).send("Password is wrong");
    }
  }
  else{
      res.status(401).send("Username is invalid");
  }
})

app.use((req, res, next) => {
  res.status(404).send("Url invalid");
})

// app.listen(PORT, () => {
//   console.log("Server running");
// })

module.exports = app;
