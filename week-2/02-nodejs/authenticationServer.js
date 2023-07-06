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
const { v4: uuidv4 } = require('uuid');
app.use(express.json());

// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
let database=[];

app.post('/signup',(req,res)=>{
  let check=database.find((user)=>{
    return user.email===req.body.email;
  })
  if(check === undefined)
  {
    let newuser={
      id : uuidv4(),
      email : req.body.email,
      password : req.body.password,
      firstName : req.body.firstName,
      lastName : req.body.lastName
    }
    database.push(newuser);
    res.status(201).send("Signup successful");
  }
  else
    res.status(400).send("Bad Request");
})

app.post('/login',(req,res)=>{
  let check=database.find((user)=>{
    return (user.email===req.body.email&&user.password===req.body.password);
  })
  if(check === undefined)
    res.status(401).send("Unauthorized");
  else
    res.send(check);
})

app.get('/data',(req,res)=>{
  let check=database.find((user)=>{
    return (user.email===req.headers.email&&user.password===req.headers.password);
  })
  if(check === undefined)
    res.status(401).send("Unauthorized");
  else
  {
    let allusers=[];
    for(let user of database)
    {
      let data={
        id:user.id,
        firstName : req.body.firstName,
        lastName : req.body.lastName
      }
      allusers.push(data);
    }
    let senddata={users : allusers};
    res.send(senddata);
  }
})

app.all('*',(rq,res)=>{
  res.status(404).send("Not found");
})

// app.listen(3003,()=>{
//   console.log("Server is now live.")
// })

module.exports = app;
