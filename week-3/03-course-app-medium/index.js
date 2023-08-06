const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
app.use(express.json());
const PORT = 3000;
const JWTSECRET = "supersecretvalue";
const adminsPath = "./data/admins.json";
const usersPath = "./data/users.json";
const coursesPath = "./data/courses.json";

function file2Array(fp) {
  try {
    arr = JSON.parse(fs.readFileSync(fp, "utf8"));
  } catch (e) {
    console.log(`Error from file2Array : ${e}`);
    arr = [];
  }
  return arr;
}

function array2File(arr, fp) {
  try {
    fs.writeFileSync(fp, JSON.stringify(arr), "utf-8");
  } catch (e) {
    console.log(`Error from array2File : ${e}`);
    throw new Error(`Error from array2File : ${e}`);
  }
}

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWTSECRET, (err, payload) => {
      if (err) {
        console.log(`err : ${err}`);
        return res.status(403).send("Unauthorized");
      }
      req.payload = payload;
      next();
    });
  } else {
    console.log("No auth headers provided");
    res.status(401).send("Unauthorized");
  }
}

function createUserPush(req, res, isAdmin) {
  const userType = isAdmin ? "Admin" : "User";
  const path = isAdmin ? adminsPath : usersPath;
  let USERSARRAY = file2Array(path);

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
  array2File(USERSARRAY, path);
  const token = jwt.sign(
    { username: username, role: isAdmin ? "admin" : "user" },
    JWTSECRET,
    {
      expiresIn: "1h",
    }
  );

  return res
    .status(201)
    .send({ message: `${userType} created successfully`, token: token });
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  createUserPush(req, res, true);
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const ADMINS = file2Array(adminsPath);
  const { username, password } = req.headers;

  let userInd = -1;
  for (let i = 0; i < ADMINS.length; i++) {
    if (username === ADMINS[i].username && password === ADMINS[i].password) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(400).send("Bad Request");
  }
  req.token = jwt.sign({ username, role: "admin" }, JWTSECRET, {
    expiresIn: "1h",
  });
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.token,
  });
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // logic to create a course
  COURSES = file2Array(coursesPath);
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
  array2File(COURSES, coursesPath);
  return res
    .status(200)
    .send({ message: "Course created successfully", courseId: courseId });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to edit a course
  COURSES = file2Array(coursesPath);
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
  array2File(COURSES, coursesPath);
  return res.status(200).send({ message: "Course updated successfully" });
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  // logic to get all courses
  COURSES = file2Array(coursesPath);
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
  createUserPush(req, res, false);
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const USERS = file2Array(usersPath);
  const { username, password } = req.headers;

  let userInd = -1;
  for (let i = 0; i < USERS.length; i++) {
    if (username === USERS[i].username && password === USERS[i].password) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(400).send("Bad Request");
  }
  req.token = jwt.sign({ username, role: "admin" }, JWTSECRET, {
    expiresIn: "1h",
  });
  req.userInd = userInd;
  return res.status(200).send({
    message: "Logged in successfully",
    token: req.token,
  });
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  // logic to list all courses
  COURSES = file2Array(coursesPath);
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

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to purchase a course
  COURSES = file2Array(coursesPath);
  USERS = file2Array(usersPath);
  const courseId = req.params.courseId;
  const { username, _ } = req.payload;
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
    let userInd = -1;
    for (let i = 0; i < USERS.length; i++) {
      if (username === USERS[i].username) {
        userInd = i;
      }
    }
    if (userInd === -1) {
      return res.status(409).send(`User with username = ${username} not found`);
    }
    USERS[userInd].coursesPurchased.push(courseId);
    array2File(USERS, usersPath);
    return res.status(200).send({ message: "Course purchased successfully" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  // logic to view purchased courses
  USERS = file2Array(usersPath);
  COURSES = file2Array(coursesPath);
  const { username, _ } = req.payload;
  let userInd = -1;
  for (let i = 0; i < USERS.length; i++) {
    if (username === USERS[i].username) {
      userInd = i;
    }
  }
  if (userInd === -1) {
    return res.status(409).send(`User with username = ${username} not found`);
  }
  const courseIds = USERS[userInd].coursesPurchased;
  ans = {
    purchasedCourses: COURSES.filter((elem) =>
      courseIds.includes(elem.courseId)
    ),
  };
  return res.status(200).send(ans);
});

// app.listen(PORT, () => {
//   console.log("Server is listening on port 3000");
// });

module.exports = app;
