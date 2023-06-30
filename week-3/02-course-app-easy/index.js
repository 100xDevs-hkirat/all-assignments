const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  var user = req.body;
  var already_exist = false;
  for (var i =0; i < ADMINS.length; i++){
    if(ADMINS[i].username === user.username){
      already_exist = true;
      break;
    }
  }
  if(already_exist){
    res.statusCode(400);
  }else{
    ADMINS.push(user);
    res.send({message: "Admin created successfully"});
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  for(var i =0; i < ADMINS.length; i++){
    if (ADMINS[i].username === username && ADMINS[i].password === password){
      valid_user = true;
      break;
    }
  }
 if(valid_user){
  res.statusCode(200).send({message: "Logged in successfully"});
 } else{
  res.statusCode(401);
 }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  var username = req.headers.username;
  var password = req.headers.password;
  var course = req.body;
  var valid_user = false;
  for(var i =0; i < ADMINS.length; i++){
    if (ADMINS[i].username === username && ADMINS[i].password === password){
      valid_user = true;
      break;
    }
  }
  var new_course = {
    title: course.title,
    description: course.description,
    price: course.price,
    imageLink: course.imageLink,
    published: course.published,
    id: Math.floor(Math.random() * 1000000)
  }
  if(valid_user){
    COURSES.push(new_course);
    res.send({message: "Course created successfully", courseID: new_course.id});
  } else{
    res.statusCode(401);
  }
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  var username = req.headers.username;
  var password = req.headers.password;
  var course = req.body;
  var courseID = parseInt(req.params.courseId)
  var valid_user = false;
  for(var i =0; i < ADMINS.length; i++){
    if (ADMINS[i].username === username && ADMINS[i].password === password){
      valid_user = true;
      break;
    }
  }
  if(valid_user){
    for(var i =0; i < COURSES.length; i++){
      
      if( COURSES[i].id === courseID ){
         COURSES[i].id = course.id;
         COURSES[i].title = course.title;
         COURSES[i].description = course.description;
         COURSES[i].price = course.price;
         COURSES[i].imageLink = course.imageLink;
         COURSES[i].published = course.published;
         
      }
    }
    res.send({message: "Course updated successfully"});
  } else{
    res.statusCode(401);
  }
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  var username = req.headers.username;
  var password = req.headers.password;
  var valid_user = false;
  for(var i =0; i < ADMINS.length; i++){
    if (ADMINS[i].username === username && ADMINS[i].password === password){
      valid_user = true;
      break;
    }
  }
  if(valid_user){
    all_courses = []
    for (var i =0; i < COURSES.length; i++){
      all_courses.push(COURSES[i]);
    }
    res.json({courses: all_courses});
  }

});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  var user = req.body;
  var already_exist = false;
  for (var i =0; i < USERS.length; i++){
    if(USERS[i].username === user.username){
      already_exist = true;
      break;
    }
  }
  if(already_exist){
    res.statusCode(400);
  }else{ var new_user_data = {};
    new_user_data = {
      username: user.username,
      password: user.password,
      purchasedCourses: []
    }
    USERS.push(new_user_data);
    res.send({message: "User created successfully"});
  }

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  for(var i =0; i < USERS.length; i++){
    if (USERS[i].username === username && USERS[i].password === password){
      valid_user = true;
      break;
    }
  }
  if(valid_user){
    res.statusCode(200).send({message: "Logged in successfully"});
   } else{
    res.statusCode(401);
   }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  for(var i =0; i < USERS.length; i++){
    if (USERS[i].username === username && USERS[i].password === password){
      valid_user = true;
      break;
    }
  }
  if(valid_user){
    res.json({courses: COURSES})
  } else{
    res.statusCode(401);
  }
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  var courseID = parseInt(req.params.courseId)
  for(var i =0; i < USERS.length; i++){
    if (USERS[i].username === username && USERS[i].password === password){
      valid_user = true;
      break;
    }
  }
  if (valid_user){
    for (var i =0; i < COURSES.length; i++){
      if( COURSES[i].id === courseID ){
        for (var j =0; j < USERS.length; j++){
          if(username === USERS[j].username){
            USERS[j].purchasedCourses.push(COURSES[i]);
            res.send({message: "Course purchased successfully"});
          }
        }
      }
    }
  } else{res.statusCode(401);}

});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  var username = req.headers.username;
  var password = req.headers.password
  var valid_user = false;
  for(var i =0; i < USERS.length; i++){
    if (USERS[i].username === username && USERS[i].password === password){
      valid_user = true;
      break;
    }
  }
  if(valid_user){
    for(var i =0; i<USERS.length; i++){
      if(username === USERS[i].username){
        res.json({purchasedCourses: USERS[i].purchasedCourses})
      }
    }
  } else {res.statusCode(401);}
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
