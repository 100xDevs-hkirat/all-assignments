const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const secretKey = "BatMaN1@@8";
const user_secretKey = "I@aMBaTman";

const generateJwt_admin = (user) => {
  const payload = {username : user.username, };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};


const authJWT_admin = (request, response, next)=>{
  const authHeader = request.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[1]; // since authorization fron header have an additional string at start
    jwt.verify(token, secretKey, (err, user)=>{
      if(err){
        response.sendStatus(403);
      }
      request.user = user;
      next();
    });
  }
  else{
    response.sendStatus(401);
  }
}

const generateJwt_user= (user) => {
  const payload = {username : user.username, };
  return jwt.sign(payload, user_secretKey, { expiresIn: '1h' });
};


const authJWT_user = (request, response, next)=>{
  const authHeader = request.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[1]; // since authorization fron header have an additional string at start
    jwt.verify(token, user_secretKey, (err, user)=>{
      if(err){
        response.sendStatus(403);
      }
      request.user = user;
      next();
    });
  }
  else{
    response.sendStatus(401);
  }
}



// - POST /admin/signup
//    Description: Creates a new admin account.
//    Input: { username: 'admin', password: 'pass' }
//    Output: { message: 'Admin created successfully', token: 'jwt_token_here' }

// Admin routes
app.post('/admin/signup', (request, response) => {
  // logic to sign up admin

  var data = request.body;

  const already_exists = ADMINS.find( c => data.username === c.username );

  if(already_exists){
    response.status(403).json({message: 'Admin already exists' });
  }else{
    ADMINS.push(data);
    const token = generateJwt_admin(data);
    response.json({message: 'Admin created successfully', token});
  }

});


// POST /admin/login
//    Description: Authenticates an admin. It requires the admin to send username and password in the headers.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Logged in successfully', token: 'jwt_token_here' }

app.post('/admin/login', (request, response) => {
  // logic to log in admin
  const {username, password} = request.headers;

  const admin = ADMINS.find(c => c.username == username && c.password == password)

  if(admin){
    var token = generateJwt_admin(admin);
    response.json({ message: 'Logged in successfully', token });
  }
  else{
    response.status(403).json({ message: 'Admin authentication failed' });
  }

});

// POST /admin/courses
//    Description: Creates a new course.
//    Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
//    Output: { message: 'Course created successfully', courseId: 1 }

app.post('/admin/courses', authJWT_admin, (request, response ) => {
  // logic to create a course
  var data = request.body;
  data.id = COURSES.length+1;
  COURSES.push(data);
  response.json({message: 'Course created successfully', courseId: data.id })

});

// PUT /admin/courses/:courseId
//    Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
//    Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }, Body: { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false }
//    Output: { message: 'Course updated successfully' }

app.put('/admin/courses/:courseId', authJWT_admin, (request, response) => {
  // logic to edit a course
  var id = parseInt(request.params.courseId);
  var index = COURSES.findIndex(c => c.id === id);
  console.log(index);
  
  var data = request.body;

  console.log(data);
  
  if(index > -1){
    const updatedCourse = { ...COURSES[index], ...request.body }; // new syntax :L it updates COURSES[courseIndex] with any extras from request.body 
    
    COURSES[index] = updatedCourse;
    response.json({message: 'Course updated successfully'})
  }else{
    response.status(404).json({ message: 'Course not found' });
  }
});

// GET /admin/courses
//    Description: Returns all the courses.
//    Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }


app.get('/admin/courses', authJWT_admin, (request, response) => {
  // logic to get all courses
  response.json({courses: COURSES});
});


// POST /users/signup
// Description: Creates a new user account.
// Input: { username: 'user', password: 'pass' }
// Output: { message: 'User created successfully', token: 'jwt_token_here' }

// User routes
app.post('/users/signup', (request, response) => {
  // logic to sign up user

  var {username, password} = request.body;

  const is_exists = USERS.find(c => c.username === username);

  if(is_exists){
    response.status(403).json({ message: 'User already exists' });

  }
  else{
    USERS.push(request.body);
    var token = generateJwt_user(request.body);
    response.json({message: 'User created successfully', token: token});
  }

});

// POST /users/login
// Description: Authenticates a user. It requires the user to send username and password in the headers.
// Input: Headers: { 'username': 'user', 'password': 'pass' }
// Output: { message: 'Logged in successfully', token: 'jwt_token_here' }

app.post('/users/login', (request, response) => {
  // logic to log in user

  var {username, password} = request.headers;
  var is_user = USERS.find(user => user.username === username && user.password === password );

  if(is_user){
    var token = generateJwt_user(request.headers);
    response.json({message: 'Logged in successfully', token: token})
  }
  else{
    response.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses', authJWT_user, (request, response) => {
  // logic to list all courses
  response.json({courses: COURSES});
});

app.post('/users/courses/:courseId', authJWT_user, (request, response) => {
  // logic to purchase a course
  var courseId = parseInt(request.params.courseId);

  var is_there = COURSES.find(c => c.id === courseId);

  console.log(is_there);

  if(is_there){
    var us = USERS.find(us => us.username === request.user.username);
    if(us){
      //add purchasedCourses to object
      if(!us.purchasedCourses){
        us.purchasedCourses = [];
      }
      us.purchasedCourses.push(is_there);
      response.json({ message: 'Course purchased successfully' });

    }
    else{
      response.status(404).json({ message: 'User not found' });
    }
  }
  else{
    response.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authJWT_user, (request, response) => {
  // logic to view purchased courses
  var user = USERS.find(us => us.username === request.user.username);
  if(user && user.purchasedCourses){
    response.json({ purchasedCourses: user.purchasedCourses });
  }
  else{
    response.status(404).json({ message: 'No courses purchased' });
  }

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
