const express = require('express');
//const bodyParser = require('body-parser');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let id = 1;

// Admin routes
app.post('/admin/signup', (req, res) => {// logic to sign up admin
  let admin = req.body;
  ADMINS.push({
    username: admin.username,
    password: admin.password
  });

  res.status(201).json({ message: 'Admin created successfully' });
});

app.post('/admin/login', (req, res) => {// logic to log in admin
  let adminHeaders = req.headers;

  let admin = authenticateUser(ADMINS, adminHeaders.username, adminHeaders.password);
  if(admin !== undefined)
      return res.json({ message: 'Logged in successfully' });

  res.json({ message: 'Invalid Admin Credentials' });

});

app.post('/admin/courses', (req, res) => {// logic to create a course
  let adminHeaders = req.headers;
  let course = req.body;
  let courseId = id;
  COURSES.push({
    title: course.title,
    description: course.description,
    price: course.price,
    imageLink: course.imageLink,
    published: course.published,
    id: courseId
  });

  id++;

  res.status(201).json({ message: 'Course created successfully', courseId: courseId });

});

app.put('/admin/courses/:courseId', (req, res) => {// logic to edit a course
  let adminHeaders = req.headers;
  let courseId = req.params.courseId
  let updatedCourseDetails = req.body;

  let courseIndex = findCourse(courseId);
  if(courseIndex !== -1){
    COURSES[courseIndex].title = updatedCourseDetails.title;
    COURSES[courseIndex].description = updatedCourseDetails.description;
    COURSES[courseIndex].price = updatedCourseDetails.price;
    COURSES[courseIndex].imageLink = updatedCourseDetails.imageLink;
    COURSES[courseIndex].published = updatedCourseDetails.published;

    return res.json({ message: 'Course updated successfully' })
  }

  res.send({ message: 'Course with the course Id does not exist' });

});

app.get('/admin/courses', (req, res) => {// logic to get all courses
  let adminHeaders = req.headers;

  res.json({ courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {// logic to sign up user
  let user = req.body;
  USERS.push({
    username: user.username,
    password: user.password
    //purchasedCourses: []
  });

  res.status(201).json({ message: 'User created successfully' });
});

app.post('/users/login', (req, res) => {// logic to log in user
  let userHeaders = req.headers;

  let user = authenticateUser(USERS, userHeaders.username, userHeaders.password);
  if(user !== undefined)
      return res.send({ message: 'Logged in successfully' });

  res.send({ message: 'Invalid User Credentials'});
});

app.get('/users/courses', (req, res) => {// logic to list all courses
  let userHeaders = req.headers;

  res.json({ courses: COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {// logic to purchase a course
  let userHeaders = req.headers;

  let user = authenticateUser(USERS, userHeaders.username, userHeaders.password);
  let courseIndex = findCourse(req.params.courseId);

  if(courseIndex !== -1){
    if('purchasedCourses' in user){
      user.purchasedCourses.push(COURSES[courseIndex]);
    }else{
      user.purchasedCourses = [];
      user.purchasedCourses.push(COURSES[courseIndex]);
    }
  
    return res.json({ message: 'Course purchased successfully' });
  } 

  res.send({ message: 'Course with the course Id does not exist to Purchase' });
});

app.get('/users/purchasedCourses', (req, res) => {
  let userHeaders = req.headers;

  let user = authenticateUser(USERS, userHeaders.username, userHeaders.password);

  if('purchasedCourses' in user){
    return res.json({ purchasedCourses: user.purchasedCourses });
  }else{
    return res.json({ purchasedCourses: "No Purchased Courses" });
  }
  
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

function authenticateUser(list, username, password){
  return  list.find(value => (value.username === username && value.password === password));
}

function findCourse(courseId){
  return COURSES.findIndex(course => course.id === parseInt(courseId));
}