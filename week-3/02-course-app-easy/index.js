const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Helper Function
function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

const isAdmin = (username, password) => {
  const flag = ADMINS.find(admin => admin.username === username);
  if(flag == undefined) {
    return 0;
  }
  if(flag.password === password) {
    return {...flag, pass: true}
  }
  return {...flag, pass: false};
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  if(!username || username == '' || !password || password == '') {
    return res.status(400).json({message: "Bad fetch request"});
  }
  const id = generateRandomId(10);
  const admin = {username, password, id};
  const isAdmin = ADMINS.find(a => a.username == username);
  if(isAdmin != undefined) {
    return res.status(400).json({message: "Username already exixts :("});
  }
  ADMINS.push(admin);
  return res.status(200).json({
    message: 'Admin created successfully'
  });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const is = isAdmin(username, password);
  if(is == 0) {
    return res.status(404).json({
      message: "User not found :("
    });
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  return res.status(200).json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const {username, password} = req.headers;
  const {title, description, price, imageLink, published} = req.body;
  const is = isAdmin(username, password);
  if(is == 0) {
    return res.status(404).json({
      message: "Only Admin can create a course :("
    });
  }
  if(is.pass == false) {
    return res.status(400).json({ message: 'Password error' });
  }
  const courseId = generateRandomId(Math.floor(Math.random() * 20) + 1);
  const course = {title, description, price, imageLink, published, courseId};
  COURSES.push(course);
  return res.status(200).json({
    message: 'Course created successfully',
    courseId
  });
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
