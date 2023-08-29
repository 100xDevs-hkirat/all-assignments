const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  //  Check if the username is already taken
  if ( ADMINS.some(admin => admin.username === username)) {
    return res.status(409).json({ error: 'Username is already taken' });
  }
  // Create a new admin user objec
  const newAdmin = {
    username,
    password, 
  };

  // Add the new admin to the ADMINS array
  ADMINS.push(newAdmin);

  return res.status(201).json({ message: 'Admon user created successfully' });

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const ACTIVE_SESSIONS = [];

  const { username, password} = req.body;
  // Find the admin with the given username
  const admin =   ADMINS.find(admin => admin.username === username);

  //  Check if admin exists and tje password matches
  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Generate a session token (for simplicity using a random string)
  
  const sessionToken = Math.random().toString(36).substring(7);

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const { courseName, instuctor, duration } = req.body;

  //  Create a new course object 
  const newCourse = {
    courseName,
    instuctor,
    duration,
  };

  COURSES.push(newCourse);

  return res.status(201).json( { mesaage: 'Course created successully', course: newCourse });
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

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
