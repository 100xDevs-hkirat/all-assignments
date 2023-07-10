const express = require('express');
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const USERSECRET = "users3cr3t";
const ADMINSECRET = "admins3cr3t";

function userGenerateJwt(user) {
  let admin = { username: user.username };
  return jwt.sign(admin, USERSECRET, { expiresIn: "1h" });
}

function adminGenerateJwt(user) {
  let admin = { username: user.username };
  return jwt.sign(admin, ADMINSECRET, { expiresIn: "1h" });
}

const adminAuthenticationJwt = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    let jwtToken = token.split(' ');
    jwt.verify(jwtToken[1], ADMINSECRET, (err, original) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = original;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const userAuthenticationJwt = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    let jwtToken = token.split(' ');
    jwt.verify(jwtToken[1], USERSECRET, (err, original) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = original;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  let admin = req.body;
  if (admin.username === "" || admin.password === "") {
    res.status(404).json({
      message: "Encorrect user inputs"
    });
  } else {
    let check = ADMINS.find(ele => ele.username === admin.username && ele.password === admin.password);
    if (check) {
      res.status(404).json({ message: "Admin already exits" });
    } else {
      ADMINS.push(admin);
      const jwtToken = adminGenerateJwt(admin);
      res.status(200).json({ message: "Admin created Successfully", token: jwtToken });
    }
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let admin = req.headers;
  let check = ADMINS.find(ele => ele.username === admin.username && ele.password === admin.password);
  if (check) {
    let jwtToken = generateJwt(admin);
    res.status(200).json({
      message: "Login Successfull",
      token: jwtToken
    });
  } else {
    res.status(404).json({
      message: "Invalid username and password"
    });
  }
});

app.post('/admin/courses', adminAuthenticationJwt, (req, res) => {
  // logic to create a course
  let course = Object.assign({ ...req.body }, { id: COURSES.length + 1 });
  COURSES.push(course);
  res.status(200).json(course);
});

app.put('/admin/courses/:courseId', adminAuthenticationJwt, (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let course = COURSES.find(ele => parseInt(ele.id) === parseInt(courseId));
  if (course) {
    let bodyContent = req.body;
    let index = COURSES.findIndex(ele => ele.id === courseId);
    COURSES[index] = Object.assign({ ...course }, bodyContent);
    res.status(200).json(COURSES[index]);
  } else {
    res.status(404).json({ message: "No such course found" });
  }
});

app.get('/admin/courses', adminAuthenticationJwt, (req, res) => {
  // logic to get all courses
  res.status(200).json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user = req.body;
  if (user.username === "" || user.password === "") {
    res.sendStatus(404);
  } else {
    let check = USERS.find(ele => ele.username === user.username && password === user.password);
    if (check) {
      res.status(404).json({ message: "User already exits" });
    } else {
      const jwtToken = userGenerateJwt(user);
      USERS.push(user);
      res.status(200).json({ message: "User created Successfully", token: jwtToken });
    }
  }
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  let user = req.body;
  if (user.username === "" || user.password === "") {
    res.sendStatus(404);
  } else {
    let check = USERS.find(ele => ele.username === user.username && password === user.password);
    if (check) {
      let jwtToken = generateJwt(user);
      res.status(200).json({ message: "Login Successfull", token: jwtToken });
    } else {
      res.status(404).json({ message: "Invalid usernane and password" });
    }
  }
});

app.get('/users/courses', userAuthenticationJwt, (req, res) => {
  // logic to list all courses
  let courses = COURSES.filter(course => course.published === true);
  res.status(200).json({ courses: courses });
});

app.post('/users/courses/:courseId', userAuthenticationJwt, (req, res) => {
  // logic to purchase a course
  let courseId = Number(req.params.courseId);
  let check = COURSES.find(ele => parseInt(ele.id) === parseInt(courseId) && ele.published === true);
  if (check) {
    let user = USERS.find(ele => ele.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(courseId);
      res.status(200).json({ message: "course purchased", course: check });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.status(404).json({ message: "No such course exits" });
  }
});

app.get('/users/purchasedCourses', userAuthenticationJwt, (req, res) => {
  // logic to view purchased courses
  let user = USERS.find(ele => ele.username === req.user.username);
  if (user) {
    let purchasedCourses = COURSES.filter(course => user.purchasedCourses.includes(course.id));
    res.status(200).json({ purchasedCourses: purchasedCourses });
  } else {
    res.sendStatus(404);
  }
});

app.use((req, res, next) => {
  res.status(404).send("No such route found");
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
