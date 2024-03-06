require("dotenv").config();
const Admin = require("./models/ADMINS");
const express = require('express');
const app = express();
const connectDb = require('./utils/database');

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', async (req, res) => {
    const username = req.headers.username;
    const password = req.headers.password;

    const adminExist = await Admin.findOne({username : username});
    console.log(adminExist);
    
    if(adminExist) {
        res.send(401);
    } 
    else {
        await Admin.create({username, password});
        res.json( {message : "Admin sgined up successfully." });
    }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

connectDb().then( () => {
  app.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
});
