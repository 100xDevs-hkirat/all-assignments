const express = require('express');
const app = express();
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASES = [];
// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
 const {username, password} = req.body;
  for(let i = 0;i<ADMINS.length;i++){
    if(ADMINS[i].username===username){
      return res.status(400).send('username already existed');
    }
  }
  ADMINS.push({username, password});
  return res.status(200).send('admin account created');
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  for(let i = 0;i<ADMINS.length;i++){
    if(ADMINS[i].username===username&&ADMINS[i].password===password){
      return res.status(200).send('Logged in succesfully');
    }
  }
  return res.status(400).send('Incorrect details entered');
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const {username, password} = req.headers;
  const {title, description, price, imageLink, published} = req.body;
  var admin = false;
  for(let i = 0;i<ADMINS.length;i++){
    if(ADMINS[i].username===username&&ADMINS[i].password===password){
       admin = true;
    }
  }
  if(admin){
    COURSES.push({ title, description, price, imageLink, published, courseId: COURSES.length + 1 });
    return res.status(201).send('Course created succeessfully');
  }
  return res.status(400).send('Enter correct details!!');
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const {username, password} = req.headers;
  const {title, description, price, imageLink, published} = req.body;
  const courseId = parseInt(req.params.courseId);
  var admin = false;
  for(let i = 0;i<ADMINS.length;i++){
    if(ADMINS[i].username===username&&ADMINS[i].password===password){
       admin = true;
    }
  }
  
  if(admin){
    for(let i = 0;i<COURSES.length;i++){
      if(COURSES[i].courseId==courseId){
        COURSES[i].title = title,
        COURSES[i].description = description,
        COURSES[i].price = price,
        COURSES[i].imageLink = imageLink,
        COURSES[i].published = published
        return res.status(200).send('updated course successfully!!');
        break;
      }
    }
  }
  return res.status(401).send('Incorrect login details');
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const {username, password} = req.headers;
  for(let i = 0;i<ADMINS.length;i++){
    if(ADMINS[i].username===username&&ADMINS[i].password===password){
      return res.status(200).json(COURSES);
    }
  }
  return res.status(401).send('Incorrect Login details entered');
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  for(let i = 0;i<USERS.length;i++){
    if(USERS[i].username===username){
      return res.status(400).send('username already existed');
    }
  }
  USERS.push({username, password});
  return res.status(200).send('user account created');
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  for(let i = 0;i<USERS.length;i++){
    if(USERS[i].username===username&&USERS[i].password===password){
      return res.status(200).send('Logged in successfully!!');
    }
  }
  return res.status(400).send('Incorrect login details');
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const {username, password} = req.headers;
  for(let i = 0;i<USERS.length;i++){
    if(USERS[i].username===username&&USERS[i].password===password){
      return res.status(200).json(COURSES);
    }
  }
  return res.status(400).send('Incorrect login details');
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var user = false;
  const {username, password} = req.headers;
  const courseId = req.params.courseId;
  for(let i = 0;i<USERS.length;i++){
    if(USERS[i].username===username&&USERS[i].password===password){
       user = true;
    }
  }
  var courseIndex = -1;
  for(let i = 0;i<COURSES.length;i++){
    if(COURSES[i].courseId==courseId){
      courseIndex = i;
    }
  }
  if(user===true && courseIndex !=-1){
      PURCHASES.push({
        username : username,
        courseIndex : courseIndex
      });
      return res.status(200).send('Course purchased successfully!!');
  }
  if(!user){
    return res.status(401).send('user not found');
  }
  if(!courseExists){
    return res.status(401).send('course does not exist');
  }
  
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var user = false;
  const {username, password} = req.headers;
  const courseId = req.params.courseId;
  let purchasedCourses = [];
  let coursesId = [];
  for(let i = 0;i<USERS.length;i++){
    if(USERS[i].username===username&&USERS[i].password===password){
       user = true;
    }
  }
  if(user){
    for(var i = 0;i<PURCHASES.length;i++){
       if(username===PURCHASES[i].username){
          purchasedCourses.push(COURSES[PURCHASES[i].courseIndex]);
       }
    }
    return res.status(200).json(purchasedCourses);
  }
  return res.status(401).send('Enter correct user details!!');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
