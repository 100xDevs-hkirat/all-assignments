const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminSecretKey = "s3ctr3t4Admin";
const userSecretKey = "s3cr3t4Us3r";

const generateAdminJwt = (user) => {
  const payload = { username: user.username, };
  return jwt.sign(payload, adminSecretKey, { expiresIn: '1h' });/*const expirationTime = Math.floor(Date.now() / 1000) + 3600; // Expires in 1 hour
                                                                 const token = jwt.sign({ payload, exp: expirationTime }, secretKey);*/  
};
const generateUserJwt = (user) => {
  const payload = { username: user.username, };
  return jwt.sign(payload, userSecretKey, { expiresIn: '1h' }); 
};
const authenticateAdminJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];//Bearer AuthToken==>["Bearer",Authtoken]
    jwt.verify(token, adminSecretKey, (err, user) => {
      if (err) 
        return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
const authenticateUserJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];//Bearer AuthToken==>["Bearer",Authtoken]
    jwt.verify(token, userSecretKey, (err, user) => {
      if (err) 
        return res.sendStatus(403);
      req.user = user;//here req.user is pointing to user in the argumnet not the actual user from the USERS array
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const adminCredentials = req.body;
  const existingAdmin = ADMINS.find(a => a.username === adminCredentials.username);
  if (existingAdmin) {
    res.status(403).send({ message: 'Admin already exists' });
  } else {
    ADMINS.push(adminCredentials);
    const token = generateAdminJwt(adminCredentials);
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    const token = generateAdminJwt(admin);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
});

app.post('/admin/courses',authenticateAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body; 
  if(course.title && course.description && course.price && course.published){

    course.id = Math.floor(Math.random()*1000000)
    COURSES.push(course);
    res.json({ message: 'Course created successfully', courseId: course.id });
    }
    else{
      res.status(400).send({ message: 'No proper details of course. Hence not added' });
    }

});

app.put('/admin/courses/:courseId',authenticateAdminJwt, (req, res) => {
  // logic to edit a course
  const courseId = Number(req.params.courseId);
  const existingCourse = COURSES.find(course => course.id === courseId);
  if (existingCourse) {
    Object.assign(existingCourse, req.body);
    res.send({ message: 'Course updated successfully' });
  } else {
    res.status(404).send({ message: 'Course not found' });
  }
  
});

app.get('/admin/courses', authenticateAdminJwt, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const user = req.body;
  const existingUser = USERS.find(u => u.username === user.username);
  if (existingUser) {
    res.status(403).send({ message: 'User already exists' });
  } else {
    const userDetails = {...req.body, purchasedCourses: []};
    USERS.push(userDetails);
    const token = generateUserJwt(user);
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateUserJwt(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).send({ message: 'User authentication failed' });
  }
});

app.get('/users/courses',authenticateUserJwt, (req, res) => {
  // logic to list all courses
  const filteredCourses=COURSES.filter(course=>course.published);//user can only see the published courses
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId',authenticateUserJwt, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if(course){
    const user=USERS.find(u=>u.username === req.user.username);
    if(user){
        user.purchasedCourses.push(courseId);
        res.json({ message: 'Course purchased successfully' });
    }
    else
    res.status(403).send({ message: 'User not found or not available' });
  } 
  else 
    res.status(404).send({ message: 'Course not found or not available' });
});

app.get('/users/purchasedCourses',authenticateUserJwt, (req, res) => {
  // logic to view purchased courses
  const user=USERS.find(u=>u.username === req.user.username);
  if(user)
    res.json({ purchasedCourses:COURSES.filter(c=>user.purchasedCourses.includes(c.id))})
  else
    res.status(403).send({ message: 'User not found' });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
