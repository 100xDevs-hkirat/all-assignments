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

const adminAuth = (request, response, next)=>{

  const {username, password} = request.headers;

  const Admin = ADMINS.find((data)=> data.username === username && data.password === password);

  if(Admin){
    next();
  }
  else{
    response.status(403).json({ message: 'Admin authentication failed' });
  }

};

const userAuth = (request, response, next)=>{

  const {username, password} = request.headers;

  const User = USERS.find((data)=>{
   if( data.username === username && data.password === password)
    {
      return data;
    }
  });

  if(User){
    request.user = User;
    next();
  }
  else{
    response.status(403).json({ message: 'User authentication failed' });
  }

};

// Admin routes
app.post('/admin/signup', (request, response) => {
  // logic to sign up admin
  var data = request.body;
  var obj = {
      username : data.username,
      password : data.password,
  }
  ADMINS.push(obj);
  response.json({ message: 'Admin created successfully' });

});

// POST /admin/login
//    Description: Authenticates an admin. It requires the admin to send username and password in the headers.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Logged in successfully' }

app.post('/admin/login', adminAuth, (request, response) => {
  // logic to log in admin
  
  response.json({ message: 'Logged in successfully' });
  
});

// POST /admin/courses
//    Description: Creates a new course.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Input: Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
//    Output: { message: 'Course created successfully', courseId: 1 }

app.post('/admin/courses', adminAuth, (request, response) => {
  // logic to create a course

  var courses_data = request.body;

  console.log(courses_data);

  courses_data.id = COURSES.length+1;
  COURSES.push(courses_data);
  response.send({ message: 'Course created successfully', "courseId":  courses_data.id });

});

// PUT /admin/courses/:courseId
//    Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Input: Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false }
//    Output: { message: 'Course updated successfully' }

app.put('/admin/courses/:courseId', adminAuth, (request, response) => {
  // logic to edit a course
  var courseId = parseInt(request.params.courseId);
  var course_data = request.body;

  const c = COURSES.find((course)=>
    course.id == courseId
  );
  console.log(c);
  if(c){
    Object.assign(c,course_data); // study about it
    response.json( { message: 'Course updated successfully' });
  }
  else{
    response.status(404).json({ message: 'Course not found' });
  }

});


// GET /admin/courses
//    Description: Returns all the courses.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, 
//    imageLink: 'https://linktoimage.com', published: true }, ... ] }


app.get('/admin/courses', adminAuth, (request, response) => {
  // logic to get all courses

  response.status(200).json({ courses: COURSES });
  
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
  response.json({ message: 'User created successfully' } );
});


// POST /users/login
//    Description: Authenticates a user. It requires the user to send username and password in the headers.
//    Input: Headers: { 'username': 'user', 'password': 'pass' }
//    Output: { message: 'Logged in successfully' }

app.post('/users/login', userAuth, (request, response) => {
  // logic to log in user
  
  response.json({ message: 'Logged in successfully' });
  
});


// GET /users/courses
//    Description: Lists all the courses.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/users/courses', userAuth, (request, response) => {
  // logic to list all courses
  var filteredCourses = COURSES.filter(c => c.published); // check if published 
  response.json({ courses: filteredCourses });
});

// POST /users/courses/:courseId
//    Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Course purchased successfully' }

app.post('/users/courses/:courseId',userAuth, (request, response) => {
  // logic to purchase a course
  var courseId = parseInt(request.params.courseId);
    
  const Course_details = COURSES.find(c => c.id == courseId && c.published);
  console.log(Course_details);
  if(Course_details){
    console.log(request.user);
    request.user.courses_bought.push(courseId);
    response.json({ message: 'Course purchased successfully' });
  }
  else{
    response.status(404).json({ message: 'Course not found or not available' })
  }
    
  

});

// GET /users/purchasedCourses
//    Description: Lists all the courses purchased by the user.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', 
//    price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/users/purchasedCourses',userAuth, (request, response) => {
  // logic to view purchased courses

 var purchasedCoursesids = request.user.courses_bought;

 var purchasedCourses = [];

 for(var i=0;i<COURSES.length;i++){
  if(purchasedCoursesids.find(id => id == COURSES[i].id)){
    purchasedCourses.push(COURSES[i]);
  }
 }
 response.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
