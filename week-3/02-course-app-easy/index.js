const express = require('express');
const app = express();
const bodyParser = require('body-parser')

app.use(express.json());
app.use(bodyParser.json());

const ADMIN = 'admin';
const USER = 'user';

let ADMINS = [];
let USERS = [];
let COURSES = [];

let username, password

const authn = (type, headers) => {
  username = headers.username;
  password = headers.password;

  switch (type) {
    case USER: 
      for(let i = 0; i < USERS.length; i++) {
        if (USERS[i].username == username) {
          if (USERS[i].password == password) {
            return i;
          }
        }
      }
      break;
  
    case ADMIN: 
      for(let i = 0; i < ADMINS.length; i++) {
        if (ADMINS[i].username == username) {
          if (ADMINS[i].password == password) {
            return i;
          }
        }
      }
      break;

    default:
  }

  return -1;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  username = req.body.username;
  password = req.body.password;

  ADMINS.push({
    username: username,
    password: password
  })

  res.json({ message: 'Admin created successfully' })
});

app.post('/admin/login', (req, res) => {
  let index = authn(ADMIN, req.headers);

  if (index != -1) {
    return res.json({ message: 'Logged in successfully' });
  }

  res.sendStatus(401);
});

app.post('/admin/courses', (req, res) => {
  let index = authn(ADMIN, req.headers);

  if (index != -1) {
    let course = req.body;
    course.id = Math.floor(Math.random() * 1000000);

    COURSES.push(course);

    return res.json({ message: 'Course created successfully', courseId: course.id })
  }

  res.sendStatus(401);
});

app.put('/admin/courses/:courseId', (req, res) => {
  let index = authn(ADMIN, req.headers);

  if (index != -1) {
    let courseId = parseInt(req.params.courseId);

    for (let i = 0; i < COURSES.length; i++) {
      if (COURSES[i].id == courseId) {
        COURSES[i] = req.body;
        COURSES[i].id = courseId;

        return res.json({ message: 'Course updated successfully' });
      }
    }

    return res.sendStatus(404);
  }

  res.sendStatus(401);
});

app.get('/admin/courses', (req, res) => {
  let index = authn(ADMIN, req.headers);

  if (index != -1) {
    return res.json({courses: COURSES});
  }

  res.sendStatus(401);
});

// User routes
app.post('/users/signup', (req, res) => {
  username = req.body.username;
  password = req.body.password;

  USERS.push({
    username: username,
    password: password,
    purchasedCourses: []
  })

  res.json({ message: 'User created successfully' })
});

app.post('/users/login', (req, res) => {
  let index = authn(USER, req.headers);

  if (index != -1) {
    return res.json({ message: 'Logged in successfully' });
  }

  res.sendStatus(401);
});

app.get('/users/courses', (req, res) => {
  let index = authn(USER, req.headers);

  if (index != -1) {
    return res.json({courses: COURSES});
  }

  res.sendStatus(401);
});

app.post('/users/courses/:courseId', (req, res) => {
  let index = authn(USER, req.headers);

  if (index != -1) {
    let courseId = parseInt(req.params.courseId);

    for (let i = 0; i < COURSES.length; i++) {
      if (COURSES[i].id == courseId) {
        USERS[index].purchasedCourses.push(COURSES[i]);
        return res.json({ message: 'Course purchased successfully' });
      }
    }

    return res.sendStatus(404);
  }

  res.sendStatus(401);
});

app.get('/users/purchasedCourses', (req, res) => {
  let index = authn(USER, req.headers);

  if (index != -1) {
    return res.json({purchasedCourses: USERS[index].purchasedCourses})
  }

  res.sendStatus(401);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
