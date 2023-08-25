const express = require('express');
const app = express();

const jwt = require('jsonwebtoken')

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secret = "daasbdk12uh3r"

const generateJwt = (admin) => {
  const username = admin.username;
  const ans = jwt.sign(username, secret)
  return ans
}

const verifyJwt = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  jwt.verify(token, secret, (err, str)=> {
    if(err) {
      res.status(403).json({message: "Invalid Jwt token"})
    }
    console.log(str)
    req.user = str
    next();
  })
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username)
  if(existingAdmin) {
    res.status(403).json({message : 'Admin already exists'})
  } else {
    ADMINS.push(admin)
    const token = generateJwt(admin)
    res.json({message : 'Admin created successfully', token: token})
  }

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const existingAdmin = ADMINS.find((a) => a.username === username && a.password === password)
  if(existingAdmin) {
    const token = generateJwt(existingAdmin)
    res.json({ message: 'Logged in successfully', token: token })
  } else {

  }
  
});

app.post('/admin/courses', verifyJwt, (req, res) => {
  // logic to create a course
  const course = req.body
  const title = COURSES.find(c => c.title === course.title)
  if(title) {
    res.status(409).json({message: "Course already exist"})
  } else {
    course.id = Date.now()
    COURSES.push(course)
    res.json({message: 'Course created successfully', courseId: course.id})
  }
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

app.listen(3005, () => {
  console.log('Server is listening on port 3005');
});
