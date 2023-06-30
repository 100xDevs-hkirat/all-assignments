const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


// POST /admin/signup
//    Description: Creates a new admin account.
//    Input: { username: 'admin', password: 'pass' }
//    Output: { message: 'Admin created successfully' }

// Admin routes
app.post('/admin/signup', (request, response) => {
  // logic to sign up admin
  var data = request.body;
  var obj = {
      username : data.username,
      password : data.password,
  }
  ADMINS.push(obj);
  response.send({ message: 'Admin created successfully' });

});

// POST /admin/login
//    Description: Authenticates an admin. It requires the admin to send username and password in the headers.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Logged in successfully' }

app.post('/admin/login', (request, response) => {
  // logic to log in admin
  var data = request.headers;

  var username = data.username;
  var password = data.password;

  var isadmin = ADMINS.some(function(admin){
    return admin.password === password && admin.username === username;
  })

  if(isadmin){
    response.send({ message: 'Logged in successfully' });
  }
  else{
    response.status(404).send({ message: 'Unauthorized user ' });
  }

});

// POST /admin/courses
//    Description: Creates a new course.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Input: Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
//    Output: { message: 'Course created successfully', courseId: 1 }

app.post('/admin/courses', (request, response) => {
  // logic to create a course

  var data = request.headers;
  var courses_data = request.body;

  var username = data.username;
  var password = data.password;

  var isadmin = ADMINS.some(function(admin){
    return admin.password === password && admin.username === username;
  })

  if(isadmin){
    var obj = {
      id : COURSES.length + 1,
      title : courses_data.title,
      description : courses_data.description,
      price : courses_data.price,
      imageLink : courses_data.imageLink,
      published : courses_data.published
    }
    COURSES.push(obj);
    response.send({ message: 'Course created successfully', "courseId":  obj.id });
  }
  else{
    response.status(404).send({ message: 'Unauthorized user ' });
  }

});

// PUT /admin/courses/:courseId
//    Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Input: Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false }
//    Output: { message: 'Course updated successfully' }

app.put('/admin/courses/:courseId', (request, response) => {
  // logic to edit a course
  var data = request.headers;
  var courseId = request.params;
  var course_data = request.body;

  var username = data.username;
  var password = data.password;

  var isadmin = ADMINS.some(function(admin){
    return admin.password === password && admin.username === username;
  });

  if(isadmin){
    COURSES.forEach((course)=>{
      if(course.id == courseId){

        course.title = course_data.title;
        course.description = course_data.description;
        course.price = course_data.price;
        course.imageLink = course_data.imageLink;
        course.published = course_data.published;
        
      }
    });

    response.send( { message: 'Course updated successfully' });
  }
  else{
    response.status(404).send({ message: 'Unauthorized user' });
  }

});


// GET /admin/courses
//    Description: Returns all the courses.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, 
//    imageLink: 'https://linktoimage.com', published: true }, ... ] }


app.get('/admin/courses', (request, response) => {
  // logic to get all courses

  var data = request.headers;

  var username = data.username;
  var password = data.password;

  var isadmin = ADMINS.some(function(admin){
    return admin.password === password && admin.username === username;
  });

  if(isadmin){
    response.status(200).json(COURSES);
  }
  else{
    response.status(404).send({ message: 'Unauthorized user' });
  }

});

// User routes

// POST /users/signup
//    Description: Creates a new user account.
//    Input: { username: 'user', password: 'pass' }
//    Output: { message: 'User created successfully' } 

app.post('/users/signup', (request, response) => {
  // logic to sign up user

  var data = request.body;
  var obj = {
      username : data.username,
      password : data.password,
      courses_bought : [],
  }
  USERS.push(obj);
  response.send({ message: 'User created successfully' } );
});


// POST /users/login
//    Description: Authenticates a user. It requires the user to send username and password in the headers.
//    Input: Headers: { 'username': 'user', 'password': 'pass' }
//    Output: { message: 'Logged in successfully' }

app.post('/users/login', (request, response) => {
  // logic to log in user

  var data = request.headers;

  var username = data.username;
  var password = data.password;

  var isUser = USERS.some(function(user){
    return user.password === password && user.username === username;
  })

  if(isUser){
    response.send({ message: 'Logged in successfully' });
  }
  else{
    response.status(404).send({ message: 'Unauthorized user ' });
  }

});


// GET /users/courses
//    Description: Lists all the courses.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/users/courses', (request, response) => {
  // logic to list all courses

  var data = request.headers;

  var username = data.username;
  var password = data.password;

  var isUser = USERS.some(function(user){
    return user.password === password && user.username === username;
  })

  if(isUser){
    response.status(200).json(COURSES);
  }
  else{
    response.status(404).send({ message: 'Unauthorized user ' });
  }

});

// POST /users/courses/:courseId
//    Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Course purchased successfully' }

app.post('/users/courses/:courseId', (request, response) => {
  // logic to purchase a course

  var data = request.headers;

  var courseId = request.params.courseId;

  var username = data.username;
  var password = data.password;

  var isUser = USERS.some(function(user){
    return user.password === password && user.username === username;
  })

  if(isUser){
    
    USERS.some(function(user){
      if( user.password === password && user.username === username ){
        user.courses_bought.push(courseId);
      }
    });
    response.status(200).send({ message: 'Course purchased successfully' });
  }
  else{
    response.status(404).send({ message: 'Unauthorized user ' });
  }

});

// GET /users/purchasedCourses
//    Description: Lists all the courses purchased by the user.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', 
//    price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/users/purchasedCourses', (request, response) => {
  // logic to view purchased courses

  var data = request.headers;

  var username = data.username;
  var password = data.password;

  var purchasedCourses = [];

  var isUser = USERS.some(function(user){
    if( user.password === password && user.username === username){
      purchasedCourses = user.courses_bought || [];
      return true;
    }
    else{
      return false;
    }
  });



  if(isUser){
    var sol = COURSES.filter( (course) => {purchasedCourses.includes(course.id)});
    response.status(200).json(sol);
  }
  else{
    response.status(404).send({ message: 'Unauthorized user ' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
