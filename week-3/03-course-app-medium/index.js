const { isUtf8 } = require('buffer');
const { log } = require('console');
const express = require('express');
const fs = require("fs");
const cors = require("cors");
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cors());

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

// console.log(ADMINS);
// console.log(USERS);
// console.log(COURSES);

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
    // console.log(jwtToken[1]);
    jwt.verify(jwtToken[1], ADMINSECRET, (err, original) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = original;
      // console.log(req.user);
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

app.get('/admin/me', adminAuthenticationJwt, async (req, res) => {
  const admin = await ADMINS.find(ele => ele.username === req.user.username);
  if (!admin) {
    res.status(403).json({ msg: "Admin doesnt exist" })
    return
  }
  res.json({
    username: admin.username
  });
});

app.get('/users/me', userAuthenticationJwt, async (req, res) => {
  const user = await USERS.find(ele => ele.username === req.user.username);
  if (!user) {
    res.status(403).json({ msg: "User doesnt exist" })
    return
  }
  res.json({
    username: user.username
  })
});

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
    let jwtToken = adminGenerateJwt(admin);
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

app.get('/admin/courses/:courseId', adminAuthenticationJwt, (req, res) => {
  // login to get a course
  let courseId = req.params.courseId;
  if (courseId) {
    let course = COURSES.find(c => parseInt(c.id) === parseInt(courseId));
    if (course) {
      res.json({ course: course });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
});

app.delete('/admin/courses/:courseId', adminAuthenticationJwt, (req, res) => {
  //login to delete a course
  let courseId = parseInt(req.params.courseId);
  let course = COURSES.find((ele) => parseInt(ele.id) === courseId);
  if (course) {
    const [course, ...newCourses] = COURSES;
    COURSES = newCourses;
    fs.writeFileSync('./courses.json', JSON.stringify(COURSES));
    res.json({ message: "Course Deleted", courses: COURSES });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  let user = req.body;
  if (user.username === "" || user.password === "") {
    res.sendStatus(404);
  } else {
    let check = USERS.find(ele => ele.username === user.username && ele.password === user.password);
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
  let user = req.headers;
  if (user.username === "" || user.password === "") {
    res.sendStatus(404);
  } else {
    let check = USERS.find(ele => ele.username === user.username && ele.password === user.password);
    if (check) {
      let jwtToken = userGenerateJwt(user);
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

app.get('/users/courses/:courseId', userAuthenticationJwt, (req, res) => {
  // login to get a course
  let courseId = req.params.courseId;
  if (courseId) {
    let course = COURSES.find(c => parseInt(c.id) === parseInt(courseId));
    if (course) {
      res.json({ course: course });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  }
});

app.post('/users/course/:courseId', userAuthenticationJwt, (req, res) => {
  // logic to purchase a course
  let courseId = req.params.courseId;
  let course = COURSES.find(ele => parseInt(ele.id) === parseInt(courseId) && ele.published === true);
  if (course) {
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