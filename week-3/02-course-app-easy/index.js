const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
  const info = {
    username: req.headers.username,
    password: req.headers.password
  };
  let check = ADMINS.find(ele => ele.username === info.username && ele.password === info.password);
  if (check) {
    next();
  } else {
    res.status(404).json({
      message: "Invalid username and password"
    });
  }
}

const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  let check = USERS.find(ele => ele.username === username && ele.password === password);
  if (check) {
    next();
  } else {
    res.status(404).json({
      message: "Invalid username and password"
    });
  }
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin

  const info = {
    username: req.headers.username,
    password: req.headers.password
  };

  let check = ADMINS.find(ele => ele.username === info.username && ele.password === info.password);
  if (check) {
    res.status(404).send("user Already exits...");
  } else {
    ADMINS.push(info);
    res.status(200).send("Admin created successfully");
  }
});

app.post('/admin/login', adminAuthentication, (req, res) => {
  // logic to log in admin
  res.status(200).send("Logged in successfully");
});

app.post('/admin/courses', adminAuthentication, (req, res) => {
  // logic to create a course
  let course = {
    id: COURSES.length,
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published
  }

  COURSES.push(course);
  res.status(200).json({
    message: 'Course created successfully',
    courseId: course.id
  });
});

app.put('/admin/courses/:courseId', adminAuthentication, (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let index = COURSES.findIndex(ele => ele.id === parseInt(courseId));
  if (index === -1) {
    res.status(404).json({
      message: "No such course exits"
    });
  }
  COURSES[index].title = req.body.title;
  COURSES[index].description = req.body.description;
  COURSES[index].price = req.body.price;
  COURSES[index].imageLink = req.body.imageLink;
  COURSES[index].published = req.body.published;
  res.status(200).json({
    message: "Course updated successfully",
  });
});

app.get('/admin/courses', adminAuthentication, (req, res) => {
  // logic to get all courses
  res.status(200).json({
    courses: COURSES
  })
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let { username, password } = req.headers;
  let check = USERS.find(ele => ele.username === username && ele.password === password);
  if (check) {
    res.status(404).json({
      message: "user already exits"
    });
  }
  USERS.push({
    username: username,
    password: password,
    purchasedCourse: []
  });
  res.status(200).json({
    message: "User created successfully"
  });
});

app.post('/users/login', userAuthentication, (req, res) => {
  // logic to log in user
  res.status(200).json({
    message: "Logged in successfully"
  });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // logic to list all courses
  res.status(200).json({
    courses: COURSES
  });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  // logic to purchase a course
  let id = req.params.courseId;
  let index = COURSES.findIndex(ele => ele.id === parseInt(id));
  if (index === -1) {
    res.status(404).json({ message: "No such course exits" });
  } else {
    let purchasedCourse = {
      courseId: COURSES[id].id
    };
    let userIndex = USERS.findIndex(info => info.username === req.headers.username && info.password === req.headers.password);
    USERS[userIndex].purchasedCourse.push(purchasedCourse);
    let ans = Object.assign({}, { message: "Course purchased successfully" }, COURSES[index]);
    res.status(200).json({
      response: ans
    })
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // logic to view purchased courses
  let userIndex = USERS.findIndex(info => info.username === req.headers.username && info.password === req.headers.password);
  let courses = USERS[userIndex].purchasedCourse;
  let response = [];
  for (let i = 0; i < courses.length; i++) {
    let id = COURSES.findIndex(ele => parseInt(ele.id) === parseInt(courses[i].courseId));
    response.push(COURSES[id]);
  }
  res.status(200).json({
    purchasedCourses: response
  });
});

app.use((req, res, next) => {
  res.status(404).send("No such route available...");
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
