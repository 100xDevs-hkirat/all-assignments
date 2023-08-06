const { v4: uuidv4 } = require("uuid");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;

let ADMINS = [];
let USERS = [];
let COURSES = [];

function adminLogin(req, res, next) {
  const { username, password } = req.headers;
  let userInd = -1;
  for (let i = 0; i < ADMINS.length; i++) {
    if (username === ADMINS[i].username) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(400).send("Bad Request");
  }
  if (password !== ADMINS[userInd].password) {
    return res.status(401).send("Unauthorized");
  } else {
    next();
  }
}

function userLogin(req, res, next) {
  const { username, password } = req.headers;
  let userInd = -1;
  for (let i = 0; i < USERS.length; i++) {
    if (username === USERS[i].username) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(400).send("Bad Request");
  }
  if (password !== USERS[userInd].password) {
    return res.status(401).send("Unauthorized");
  } else {
    req.headers.userInd = userInd;
    next();
  }
}

function createUserPush(req, res, USERSARRAY, isAdmin) {
  const username = req.body.username;
  for (let i = 0; i < USERSARRAY.length; i++) {
    if (username === USERSARRAY[i].username) {
      return res.status(400).send("Bad Request");
    }
  }
  const password = req.body.password;
  const userId = uuidv4();
  USERSARRAY.push({
    username: username,
    password: password,
    userId: userId,
    coursesPurchased: [],
  });
  let userType = isAdmin ? "Admin" : "User";
  res.status(201).send(`${userType} created successfully`);
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  createUserPush(req, res, ADMINS, true);
});

app.post("/admin/login", adminLogin, (req, res) => {
  // logic to log in admin
  return res.status(200).send("Logged in successfully");
});

app.post("/admin/courses", adminLogin, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  const courseId = uuidv4();
  COURSES.push({
    courseId: courseId,
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    published: published,
  });
  return res
    .status(200)
    .send({ message: "Course created successfully", courseId: courseId });
});

app.put("/admin/courses/:courseId", adminLogin, (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  let courseInd = -1;
  for (let i = 0; i < COURSES.length; i++) {
    if (courseId == COURSES[i].courseId) {
      courseInd = i;
    }
  }
  if (courseInd == -1) {
    return res
      .status(404)
      .send(`Course with courseId = ${courseId} not found!`);
  }
  const { title, description, price, imageLink, published } = req.body;
  COURSES[courseInd] = {
    courseId: courseId,
    title: title,
    description: description,
    price: price,
    imageLink: imageLink,
    published: published,
  };
  return res.status(200).send({ message: "Course updated successfully" });
});

app.get("/admin/courses", adminLogin, (req, res) => {
  // logic to get all courses
  ans = {
    courses: COURSES.map((elem) => ({
      id: elem.courseId,
      title: elem.title,
      description: elem.description,
      price: elem.price,
      imageLink: elem.imageLink,
      published: elem.published,
    })),
  };
  return res.status(200).send(ans);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  createUserPush(req, res, USERS);
});

app.post("/users/login", userLogin, (req, res) => {
  // logic to log in user
  return res.status(200).send("Logged in successfully");
});

app.get("/users/courses", userLogin, (req, res) => {
  // logic to list all courses
  ans = {
    courses: COURSES.map((elem) => ({
      id: elem.courseId,
      title: elem.title,
      description: elem.description,
      price: elem.price,
      imageLink: elem.imageLink,
      published: elem.published,
    })),
  };
  return res.status(200).send(ans);
});

app.post("/users/courses/:courseId", userLogin, (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const userInd = req.headers.userInd;
  let courseInd = -1;
  for (let i = 0; i < COURSES.length; i++) {
    if (courseId === COURSES[i].courseId) {
      courseInd = i;
    }
    if (courseInd === -1) {
      return res
        .status(409)
        .send(`Course with courseId = ${courseId} not found!`);
    }
    USERS[userInd].coursesPurchased.push(courseId);
    return res.status(200).send({ message: "Course purchased successfully" });
  }
});

app.get("/users/purchasedCourses", userLogin, (req, res) => {
  // logic to view purchased courses
  const userInd = req.headers.userInd;
  const courseIds = USERS[userInd].coursesPurchased;
  ans = {
    purchasedCourses: COURSES.filter((elem) => courseIds.includes(elem.courseId)),
  };
  return res.status(200).send(ans);
});

// app.listen(PORT, () => {
//   console.log("Server is listening on port 3000");
// });

module.exports = app;
