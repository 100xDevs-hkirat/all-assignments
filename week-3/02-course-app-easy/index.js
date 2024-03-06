const express = require('express');
const app = express();
app.use(express.json());


let ADMINS = [];
let USERS = [];
let COURSES = [];
let PURCHASED_COURSES = [];

function checkIfAdmin(req) {
    const adminCreds = {
      username : req.headers.username,
      password : req.headers.password
    };
    const checkUsername = ADMINS.find((currVal) => {
      return (currVal.username === adminCreds.username && currVal.password === adminCreds.password);
    });
    return checkUsername;
}

//- POST /admin/signup
//   Description: Creates a new admin account.
//   Input: { username: 'admin', password: 'pass' }
//   Output: { message: 'Admin created successfully' }

// Admin routes
app.post('/admin/signup', (req, res) => {
     const newAdmin = { 
      username: req.headers.username, 
      password: req.headers.password 
    };
    ADMINS.push(newAdmin);
    res.send(201);
});

// - POST /admin/login
//    Description: Authenticates an admin. It requires the admin to send username and password in the headers.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Logged in successfully' }

app.post('/admin/login', (req, res) => {   
    const checkCreds = checkIfAdmin(req);
    console.log(checkCreds);
    if(!checkCreds) {
      res.send(404);
    }
    else {
      res.json( { message: 'Logged in successfully' } );
    }
});

// - POST /admin/courses
// Description: Creates a new course.
// Input: Headers: { 'username': 'admin', 'password': 'pass' }
// Input: Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
// Output: { message: 'Course created successfully', courseId: 1 }

app.post('/admin/courses', (req, res) => {
    const checkCreds = checkIfAdmin(req);
    if(!checkCreds) {
      res.send(401);
    }
    const newCourse = { 
      id : Math.floor(Math.random() * 1000000),
      title: req.body.title, 
      description: req.body.description,
      price: req.body.price, 
      imageLink: req.body.imageLink, 
      published: req.body.published 
    };
    COURSES.push(newCourse);
    res.json( { message: 'Course created successfully', courseId: newCourse.id } );
});

// - PUT /admin/courses/:courseId
//    Description: Edits an existing course. courseId in the URL path should be replaced with the ID of the course to be edited.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Input: Body { title: 'updated course title', description: 'updated course description', price: 100, imageLink: 'https://updatedlinktoimage.com', published: false }
//    Output: { message: 'Course updated successfully' }

app.put('/admin/courses/:courseId', (req, res) => {
    // const checkCreds = checkIfAdmin(req);
    // if(!checkCreds) {
    //   res.send(401);
    // }
    var Id = parseInt(req.params.courseId);
    const checkIfCourseExist = COURSES.find((currVal) => {
      return (currVal.id === Id);
    });
    console.log(checkIfCourseExist);
    if(checkIfCourseExist === undefined) {
      res.send(404);
    }
    else {
      for (let course of COURSES) {
        if (course.id === Id) {
            course.title = req.body.title, 
            course.description = req.body.description,
            course.price = req.body.price, 
            course.imageLink = req.body.imageLink, 
            course.published = req.body.published
        }
      }
      res.json({ message: 'Course updated successfully' });
    }
});

// - GET /admin/courses
//    Description: Returns all the courses.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/admin/courses', (req, res) => {
    const checkCreds = checkIfAdmin(req);
    if(!checkCreds) {
      res.send(401);
    }
    else {
      res.json(COURSES);
    }
});

app.get('/admin/alladmin', (req, res) => {
    res.json(ADMINS);
});

// User routes

// - POST /users/signup
// Description: Creates a new user account.
// Input: { username: 'user', password: 'pass' }
// Output: { message: 'User created successfully' } 

app.post('/users/signup', (req, res) => {
    const userCreds = {
      username: req.headers.username, 
      password: req.headers.password
    };
    const alreadyExist = USERS.find((currVal) => {
      return (currVal.username === userCreds.username);
    });

    if(alreadyExist) {
      res.json({ message : 'User already exist' });
    }
    else {
      USERS.push(userCreds);
      res.json({ message: 'User created successfully'});
    }
});

// - POST /users/login
//    Description: Authenticates a user. It requires the user to send username and password in the headers.
//    Input: Headers: { 'username': 'user', 'password': 'pass' }
//    Output: { message: 'Logged in successfully' }

app.post('/users/login', (req, res) => {
    const userCreds = {
      username: req.headers.username, 
      password: req.headers.password
    };
    const isExist = USERS.find((currVal) => {
      return (currVal.username === userCreds.username && currVal.password === userCreds.password);
    });
  
    if(!isExist) {
      res.json({ message : 'Authorization failed.' });
    }
    else {
      res.json({message : 'Logged in successfully'});
    }
});

// GET /users/courses
//    Description: Lists all the courses.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { courses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/users/courses', (req, res) => {
    res.json( COURSES );
});

// - POST /users/courses/:courseId
//    Description: Purchases a course. courseId in the URL path should be replaced with the ID of the course to be purchased.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { message: 'Course purchased successfully' }

app.post('/users/courses/:courseId', (req, res) => {
    const courseToPurchase = COURSES.findIndex( (currValue) => {
        return (currValue.id === req.params.courseId);
    });
    if(courseToPurchase === -1) {
       res.send(404);
    }
    else {
      PURCHASED_COURSES.push(COURSES[index]);
      res.json( { message: 'Course purchased successfully' } );
    }
});

// - GET /users/purchasedCourses
//    Description: Lists all the courses purchased by the user.
//    Input: Headers: { 'username': 'admin', 'password': 'pass' }
//    Output: { purchasedCourses: [ { id: 1, title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }, ... ] }

app.get('/users/purchasedCourses', (req, res) => {
    res.json(PURCHASED_COURSES);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});