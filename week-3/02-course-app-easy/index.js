const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
app.use(express.json());
app.use(bodyParser.json());
let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASED = {};

// check for valid credentials
const creds_chekcer = (username, password, list) => {
  let found = false;
  if(! (username.length && password.length)) return found;
  list.forEach((account) => {
    if(account.username === username && account.password === password)
      found = true;
  });
  return found;
}

// check username and password at middleware level

const authenticator_middleWare = (req, res, next) => {
  if(req.url.includes('/signup')) next();
  else {
    let authenticated = false;
    if(req.url.includes('/admin/')){
      authenticated = creds_chekcer(req.headers.username, req.headers.password, ADMINS);
    }else{
      authenticated = creds_chekcer(req.headers.username, req.headers.password, USERS);
    }
    authenticated ? next() : res.status(401).json({message:"Invalid username or password"});
  }
}
app.use(authenticator_middleWare);


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  try{
    let existing_account = false;
    if(!req.body.username.length) res.status(400).json({message: 'username cannot be empty'});
    if(!req.body.password.length) res.status(400).json({message: 'password cannot be empty'});
    else{
      ADMINS.forEach((account) => {
        //console.log("Checking for existing username");
        if(account.username === req.body.username){ 
          existing_account = true;
          res.status(400).json({message: 'username already exists. Please use another one!'});}
      });
      if(!existing_account){
        req.body.id = uuidv4();
        ADMINS.push(req.body);
        res.status(201).json({message: 'Admin created successfully'});
      } 
    }
  }catch(err){
    res.status(503).json({message: 'Something went wrong', error:err});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  res.status(200).send({ message: 'Logged in successfully' });
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
    //console.log('Creating new Course');
    try{
      req.body.id = uuidv4();
    COURSES.push(req.body);
    res.status(200).json({message: 'Course created successfully', courseId: req.body.id});
    }catch(err){
      res.status(503).json({message: 'Something went wrong', error:err});
    }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = req.params['courseId'];
  let course_found = false;
  COURSES.forEach((course) => {
    if(course.id === courseId){
      course_found = true;
      for(let key of Object.keys(req.body)) course[key] = req.body[key];
    }
  });
  course_found ? res.status(200).json({message: "Course updatd successfully"}) :res.status(400).json({message:'Invalid course id. Course not found'});
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.status(200).json({courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  try{
    let existing_account = false;
    if(!req.body.username.length)res.status(400).json({message: 'username cannot be empty'});
    else if(!req.body.password.length) res.status(400).json({message: 'password cannot be empty'});
    else{
      USERS.forEach((account) => {
        //console.log("Checking for existing username");
        if(account.username === req.body.username){ 
          existing_account = true;
          res.status(400).json({message: 'username already exists. Please use another one!'});}
      });
      if(!existing_account){
        USERS.push({username:req.body.username, password:req.body.password, id:uuidv4()});
        res.status(201).json({message: 'User created successfully'});
      } 
    }
  }catch(err){
    res.status(503).json({message: 'Something went wrong', error:err});
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  res.status(200).send({ message: 'Logged in successfully' });
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  res.status(200).json({courses: COURSES});
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const purchasedCourseId = req.params["courseId"];
  let validateCourseId = false;
  let same_course_purchsed = false;
  COURSES.forEach((course) => {
    if(course.id === purchasedCourseId){
      validateCourseId = true;
      if(Object.keys(PURCHASED).includes(req.headers.username)){
        PURCHASED[req.headers.username].forEach((course_bought) => {
          if(course_bought.id === purchasedCourseId) same_course_purchsed = true;
        });
        ! same_course_purchsed && PURCHASED[user_id].push(course);
      }else{
        PURCHASED[req.headers.username] = [course];
      }
      ! same_course_purchsed && res.status(200).json({message: 'Course purchased successfully'})
    } 
  });
  same_course_purchsed && validateCourseId && res.status(400).json({message: "You've already purchased this course before. No need to buy again."});
  !validateCourseId && res.status(400).json({message: 'Invalid course id'});
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  res.status(200).json({purchasedCourses: PURCHASED[req.headers.username]});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
