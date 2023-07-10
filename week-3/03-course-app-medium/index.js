const { isUtf8 } = require('buffer');
const { log } = require('console');
const express = require('express');
const fs = require("fs");
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const USERSECRET = "userS3cr3t";
const ADMINSECRET = "adminS3cr3t"

try {
  ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
  USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

console.log(ADMINS);
console.log(USERS);
console.log(COURSES);

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
    return res.status(401).send("fill required fields");
  }
  let check = ADMINS.find(ele => ele.username === admin.username && ele.password === admin.password);
  if (check) {
    res.status(404).json({ message: "Admin already exits" });
  } else {
    ADMINS.push(admin);
    fs.writeFileSync("./admins.json", JSON.stringify(ADMINS));
    const jwtToken = adminGenerateJwt(admin);
    res.status(200).json({ message: "Admin created Successfully", token: jwtToken });
  }
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  let admin = req.headers;
  if (admin.username === "" && admin.password === "") {
    return res.status(401).send("fill require fields");
  }
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
  let payload = req.body;
  let course = Object.assign({ ...payload }, { id: COURSES.length + 1 });
  COURSES.push(course);
  fs.writeFileSync("./courses.json", JSON.stringify(COURSES));
  res.status(200).json({ message: "Course created successfully", course: course });
});

app.put('/admin/courses/:courseId', adminAuthenticationJwt, (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let course = COURSES.find(ele => parseInt(ele.id) === parseInt(courseId));
  if (course) {
    let index = COURSES.findIndex(ele => parseInt(ele.id) === parseInt(courseId));
    COURSES[index] = Object.assign({ ...course }, req.body);
    fs.writeFileSync("./courses.json", JSON.stringify(COURSES));
    res.status(200).json({ message: "Course Updated", course: COURSES[index] });
  } else {
    res.sendStatus(404);
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
      fs.writeFileSync("./users.json", JSON.stringify(USERS));
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
  let courseId = req.params.courseId;
  let course = COURSES.find(ele => parseInt(ele.id) === parseInt(courseId) && ele.published === true);
  if (course) {
    console.log(USERS);
    let user = USERS.find(ele => ele.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course.id);
      fs.writeFileSync("./users.json", JSON.stringify(USERS));
      res.status(200).json({ message: "course purchased", course: course });
    } else {
      res.sendStatus(404);
    }
  } else {
    res.sendStatus(404);
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
  res.status(404).json({ message: "No such route found" });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
