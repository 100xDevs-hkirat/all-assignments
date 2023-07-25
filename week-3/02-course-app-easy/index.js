const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let courseId = 1;

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var data = req.headers
  var adminObj = {
    username : data.username,
    password : data.password
  }
  ADMINS.push(adminObj);
  var mes = {
    message : "Admin created successfully"
  }
  res.status(201).json(mes)
});

function checkUser(arr, data){
  for(let i = 0 ; i <arr.length; i++){
    if(arr[i].username == data.username){
      if(arr[i].password == data.password){
        return true
        }
      }
    }
  }

function findIndex(arr, id) {
  for(let i = 0 ; i <arr.length; i++){
    if(arr[i].courseId == id){
      return i
    }
  }
  return -1
}

function findUser(arr, username){
  for(let i =0; i<arr.length; i++){
    if(arr[i].username == username){
      var userObj = {
        username: arr[i].username,
        purchasedCourses: arr[i].purchasedCourses
      }
      return userObj
    }
  }
}

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var mes = {
    message: "Logged in succcesfully"
  }
  isAdmin = checkUser(ADMINS, req.headers)
  if(isAdmin){
    res.json(mes)
  }
  else{
    res.sendStatus(401)
  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  isAdmin = checkUser(ADMINS, req.headers)
  if(isAdmin){
    var courseData = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published,
      courseId: courseId++
    };
    COURSES.push(courseData)
    var mes = {
      message: "Course created successfully",
      courseId: courseId
    }
    res.json(mes)
  }
  else{
    res.sendStatus(401)
  }

});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var isAdmin = checkUser(ADMINS, req.headers);
  if(isAdmin){
    var changeId = req.params.courseId
    var a = findIndex(COURSES, changeId)
    if(a){
      COURSES[a].title = req.body.title
      COURSES[a].description = req.body.description
      COURSES[a].price = req.body.price
      COURSES[a].imageLink = req.body.imageLink
      COURSES[a].published = req.body.published
      var mes = {
        message: "Course updated successfully",
        courseId:changeId,
        couurse: COURSES[a]
      }
      res.json(mes.message+" Course ID: "+ mes.courseId)
    }
    else{
      res.send(404)
    }

  }
  else{res.sendStatus(401)}
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var userData = req.headers;
  var isUser = checkUser(USERS, userData);
  if(!isUser){
  var userObj = {
    username : userData.username,
    password : userData.password,
    purchasedCourses: []
  }
  USERS.push(userObj);
  var mes = {
    message : "User created successfully"
  }
  res.status(201).json(mes.message)
  }

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var userData =  req.headers
  var isUser = checkUser(USERS, userData)
  if(!isUser) res.sendStatus(401)
  var mes = {
    message: "Logged in successfully"
  }
  res.send(mes.message)

});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  var isUser = (USERS, req.headers);
  if(!isUser) res.sendStatus(401)
  res.json(COURSES) 
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var ID = req.params.courseId
  var User = findUser(USERS, req.headers.username)
  var course = findIndex(COURSES, ID)
  if(course && COURSES[course].published){
    User.purchasedCourses.push(COURSES[course])
    res.json({"message": " Course purchased successfully"})
  }
  else{
    res.sendStatus(404).json({"message": "Course Not Found"})
  }

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var User = findUser(USERS, req.headers.username)
  res.json(User.purchasedCourses)
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

