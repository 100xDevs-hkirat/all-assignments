const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminSecret = "SEcrtKY1@#970";
const userSecret = "SEUserrcrtKY1@#665";

const generateJWT = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, adminSecret, { expiresIn: '1h'});
}

const generateUserJWT = (user) => {
  const payload = { username: user.username };
  return jwt.sign(payload, userSecret, {expiresIn: '1h'});
}

const verifyJWT = (req,res,next) => {
  const auth = req.headers.authorization;

  if(auth) {
    const token = auth.split(' ')[1];
    jwt.verify(token, adminSecret, (err,data) => {
      if (err) {
        res.sendStatus(403);
      }

      next();
    })
  } else {
    res.sendStatus(401);
  }
}

const verifyUserJWT = (req,res,next) => {
  const auth = req.headers.authorization;
  const user = { username: req.headers.username};

  if(auth) {
    const token = auth.split(' ')[1];
    jwt.verify(token, userSecret, (err, data) => {
      if (err) {
        res.status(403).json({message: "User authentication failed"});
      } else {
        req.user = USERS.find(e => e.username === user.username);
        next();
      }
    })
  } else {
    res.sendStatus(401);
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  const admin = req.body;

  const adminuser = ADMINS.find(e => e.username === admin.username);
  if (adminuser) {
    res.status(403).json({message: "Admin already exists"});
  } else {
    ADMINS.push(admin);
    res.json({message: "Admin created successfully"});
  }
});

app.post('/admin/login', (req, res) => {
  const admin = req.headers;

  const exists = ADMINS.find(e => e.username === admin.username && e.password === admin.password);
  if (exists) {
    const token = generateJWT(req.headers);
    res.json({message: "Logged in successfully", token: token});
  } else {
    res.status(403).json({message: "Admin authentication failed"});
  }
});

app.post('/admin/courses', verifyJWT, (req, res) => {
  const course = req.body;
  course.Id = COURSES.length + 1;
  
  const exists = COURSES.find(e => e.title === course.title);
  if(exists) {
    res.status(403).json({message: "Course title already exists"});
  } else {
    COURSES.push(course);
    res.json({message: "Course added successfully"});
  }
});

app.put('/admin/courses/:courseId', verifyJWT, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  
  const course = COURSES.find(e => e.Id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({message: "Course updated successfully"});
  } else {
    res.status(404).json({message: "Course not found or not available"});
  }
});

app.get('/admin/courses',verifyJWT, (req, res) => {
  res.json({courses: COURSES});
});


// User routes
app.post('/users/signup', (req, res) => {
  const user = Object.assign(req.body, { purchasedCourses: []});

  const exists = USERS.find(e => e.username === user.username);
  if (exists) {
    res.status(403).json({message:"User already exists"});
  } else {
    USERS.push(user);
    res.json({message: "User added successfully"});
  }
});

app.post('/users/login', (req, res) => {
  const user= req.headers;
  
  const exists = USERS.find(e => e.username  === user.username && e.password === user.password);
  if (exists) {
    const token = generateUserJWT(user);
    res.json({message: "User authenticated successfully", token: token});
  } else {
    res.status(403).json({message: "User authetication failed"});
  }
});

app.get('/users/courses', verifyUserJWT, (req, res) => {
  res.json({courses: COURSES.filter(e => e.published)});
});

app.post('/users/courses/:courseId', verifyUserJWT, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const course = COURSES.find(e => e.Id === courseId && e.published);
  if(course) {
    const user = USERS.find(e => e.username === req.user.username);
    user.purchasedCourses.push(courseId);
    
    res.json({message: "Course purchased successfully"});
  } else {
    res.status(404).json({message: "Course not found or not available"});
  }
});

app.get('/users/purchasedCourses', verifyUserJWT, (req, res) => {
  res.json({ purchasedCourses: COURSES.find(e => req.user.purchasedCourses.includes(e.Id)) });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
