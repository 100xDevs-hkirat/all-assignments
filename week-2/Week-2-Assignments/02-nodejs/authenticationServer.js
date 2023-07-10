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
const Joi = require('joi');
const { v4: uuidv4 } = require('uuid');
const PORT = 3000;
const app = express();
app.use(express.json());
const jwt = require('jsonwebtoken');

const secret = 'Ohh some $#(&e!';

const users = [];

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

// schema validators
const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};

app.post('/signup', validateBody(userSchema), (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const newUser = req.body;
  const userFound = users.find((user) => newUser.username === user.username);
  if (!userFound) {
    users.push({ id: uuidv4(), ...newUser });
    res.status(201).send('Signup successful');
  } else {
    res.status(401).send('username already exists');
  }
});

app.post('/login', validateBody(loginSchema), (req, res) => {
  const credentials = req.body;
  const userFound =
    users.find(
      (user) =>
        credentials.username === user.username &&
        credentials.password === user.password
    ) ?? null;
  if (userFound) {
    const token = jwt.sign({ username: credentials.username }, secret, {
      expiresIn: '1h',
    });
    const { password, ...user } = userFound;
    res.send({ ...user, token });
  } else {
    res.sendStatus(403);
  }
});

app.get('/data', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const { username, password } = req.headers;
  const userFound = users.find(
    (user) => username === user.username && password === user.password
  );
  if (userFound) {
    const allUsers = users.map(({ firstname, lastname, id }) => ({
      firstname,
      lastname,
      id,
    }));
    res.send(allUsers);
  } else {
    res.sendStatus(403);
  }
});

module.exports = app;
