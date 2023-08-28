const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const {username, password } = req.headers;
  const admin = ADMINS.find(a => a.username === username && a.password === password);
  if (admin) {
    next();
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
};

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user= USERS.find(u=> u.username === username && u.password === password);
  if (user) {
    req.user = user;  // Add user object to the request
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};

app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    res.json({ message: 'Admin created successfully' });
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', (req, res) => {
  const course = req.body;
  // if (!course.title){
  //   return res.join(411).send("msg":"please send me the title")
  // }
  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);// convertinng the courese id into a number
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body); //The code snippet Object.assign(course, req.body); is likely used to update the properties of the course object with the values present in the req.body object. Here's 
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  res.json({ courses: COURSES });
});

app.post('/users/signup', userAuthentication, (req, res) => {
  // const user = {...req.body, purchasedCourses: []};
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  USERS.push(user);
  res.json({ message: 'User created successfully' });
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // COURSES.filter(c => c.published)
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    // var username=req.headers["username"]
    //finnd the user in the global user array
    //update the user object
    //remove thee old user object
    //add the new  user objects to the USERS global array

         // oooooor
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  // We need to extract the complete course object from COURSES
  // which have ids which are present in req.user.purchasedCourses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4]; // thi swill get you the id's of purchased cousres
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) { //if the purchasedCourseIds doed have this COURSES[i].id then push it into purchasedCourseIds 
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
