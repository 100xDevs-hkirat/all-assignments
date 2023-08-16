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

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const app = express();
// write your logic here, DONT WRITE app.listen(3000) when you're running tests, the tests will automatically start the server
app.use(bodyParser.json());
const credentials = [];

app.use((req, res, next) => {
  const email = req.body.email ?? req.headers.email;
  const password = req.body.password ?? req.headers.password;
  const index = credentials.findIndex((user) => user.email === email);
  res.locals.index = index;
  res.locals.authorised =
    index >= 0 && credentials[index].password === password;
  next();
});

app.post('/signup', (req, res) => {
  const index = res.locals.index;
  if (index >= 0) return res.status(400).send('Bad Request');
  credentials.push({
    id: uuidv4(),
    ...req.body,
  });
  res.status(201).send('Signup successful');
});

app.post('/login', (req, res) => {
  const authorised = res.locals.authorised;
  console.log(authorised);
  if (!authorised) return res.status(401).send('Unauthorized');
  const index = res.locals.index;
  const { id, password, ...user } = credentials[index];
  res.json(user);
});

app.get('/data', (req, res) => {
  const authorised = res.locals.authorised;
  if (!authorised) return res.status(401).send('Unauthorized');
  const data = {};
  data.users = credentials.map(({ id, password, ...rest }) => rest);
  res.send(JSON.stringify(data));
});

module.exports = app;
