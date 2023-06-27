const express = require('express');
const app = express();
const {v4: uuid} = require('uuid');
//const cors = require('cors');
//const cors = require('cors');

app.use(express.json());
//app.use(cors());

let ADMINS = [];
let USERS = [];
let COURSES = [];

COURSES.push({
               "title": "course title",
               "description": "course description",
               "price": 100,
               "imageLink": "https://linktoimage.com",
               "published": true,
               "id":"123"
             });

function findIndex(arr, id) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) return i;
  }
  return -1;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
    const id = uuid();
//    let lastIdx = ADMINS.length-1;
    let newAdmin = req.body;
    newAdmin.id = id;
    ADMINS.push(newAdmin);
    res.send('Admin created successfully');
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;

  if(username == 'admin' && password == 'pass'){
    res.send('Logged in successfully')
  }
  else{
    res.send();
  }
//  let idx = findIndex(ADMINS, id)
//  if(idx == -1){
//    res.status(404).send();
//  }
//  else{
//    if(arr[idx].)
//  }
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
    const { username, password } = req.headers;

    if(username == 'admin' && password == 'pass'){
        let course = req.body;
        let id = uuid();
        course.id = id;
        COURSES.push(course);
        res.send(`Course created successfully, courseId: ${id}`)
    }
    else res.send();
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
    const { username, password } = req.headers;

    if(username == 'admin' && password == 'pass'){
        const id = req.params.courseId;
        let idx = findIndex(COURSES, id);

        if(idx == -1){
            res.send();
        }
        else{
            let course = req.body;
            COURSES[idx].title = course.title;
            COURSES[idx].description = course.description;
            COURSES[idx].price = course.price;
            COURSES[idx].imageLink = course.imageLink;
            COURSES[idx].published = course.published;

            res.send('Course updated successfully');
        }
    }
    else res.send();
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  res.json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
