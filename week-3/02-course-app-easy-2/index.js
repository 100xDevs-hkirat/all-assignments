const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(bodyParser.json());
dotenv.config();

let ADMINS = [];
let USERS = [];
let COURSES = [];

const getUserIndex = (token) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  const decodedToken = jwt.verify(token, jwtSecretKey);

  let userIdx = USERS.findIndex((user) => {
    return user.username == decodedToken.username;
  });

  return userIdx;
};

const generateToken = (username) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  let data = {
    time: Date(),
    username,
  };

  const token = jwt.sign(data, jwtSecretKey, { expiresIn: "1h" });
  return token;
};

const validateToken = (token) => {
  let jwtSecretKey = process.env.JWT_SECRET_KEY;
  if (!token) {
    return false;
  }

  const decodedToken = jwt.verify(token, jwtSecretKey);
  return true;
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  username = req.body.username;
  password = req.body.password;

  // Validate user input
  if (!(username && password)) {
    res.status(400).send("All inputs are required");
  }

  // check if user already exist
  // Validate if user exist in our database
  let oldUser = ADMINS.find((admin) => {
    return admin.username == username;
  });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login...");
  }

  ADMINS.push({
    username: username,
    password: password,
  });

  let token = generateToken(username);

  res.json({ message: "Admin created successfully", token: token });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;

  let idx = ADMINS.findIndex((admin) => {
    return admin.username == username && admin.password == password;
  });

  if (idx == -1) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let token = generateToken(ADMINS[idx].username);
  res.json({ message: "Logged in successfully", token: token });
});

app.post("/admin/courses", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let verified = validateToken(token);

  if (verified) {
    let course = req.body;
    course.id = Math.floor(Math.random() * 1000000);

    COURSES.push(course);

    return res.json({
      message: "Course created successfully",
      courseId: course.id,
    });
  }

  return res.sendStatus(401);
});

app.put("/admin/courses/:courseId", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let verified = validateToken(token);

  if (verified) {
    let courseId = parseInt(req.params.courseId);

    let idx = COURSES.findIndex((course) => {
      return course.id == courseId;
    });

    if (idx != -1) {
      COURSES[idx] = req.body;
      COURSES[idx].id = courseId;

      return res.json({ message: "Course updated successfully" });
    }

    return res.sendStatus(404);
  }

  return res.sendStatus(401);
});

app.get("/admin/courses", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let verified = validateToken(token);

  if (verified) {
    return res.json({ courses: COURSES });
  }

  res.sendStatus(401);
});

// User routes
app.post("/users/signup", (req, res) => {
  username = req.body.username;
  password = req.body.password;

  // Validate user input
  if (!(username && password)) {
    res.status(400).send("All inputs are required");
  }

  // check if user already exist
  // Validate if user exist in our database
  let oldUser = USERS.find((user) => {
    return user.username == username;
  });

  if (oldUser) {
    return res.status(409).send("User Already Exist. Please Login...");
  }

  USERS.push({
    username: username,
    password: password,
    purchasedCourses: []
  });

  let token = generateToken(username);

  res.json({ message: "User created successfully", token: token });
});

app.post("/users/login", (req, res) => {
  const { username, password } = req.headers;

  let idx = USERS.findIndex((user) => {
    return user.username == username && user.password == password;
  });

  if (idx == -1) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  let token = generateToken(USERS[idx].username);
  res.json({ message: "Logged in successfully", token: token });
});

app.get("/users/courses", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let verified = validateToken(token);

  if (verified) {
    return res.json({ courses: COURSES });
  }

  res.sendStatus(401);
});

app.post("/users/courses/:courseId", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let verified = validateToken(token);

  if (verified) {
    let courseId = parseInt(req.params.courseId);

    let courseIdx = COURSES.findIndex((course) => {
      return course.id == courseId;
    });

    if (courseIdx == -1) {
      return res.sendStatus(404);
    }

    // get caller's index in USERS[] from (username in) token
    let userIdx = getUserIndex(token);

    // check if course already exists
    let courseAlreadyPresent = USERS[userIdx].purchasedCourses.findIndex((course) => {
      return course.id == COURSES[courseIdx].id;
    })

    if (courseAlreadyPresent != -1) {
      return res.status(409).send('Course already purchased');
    }

    USERS[userIdx].purchasedCourses.push(COURSES[courseIdx]);
    return res.json({ message: 'Course purchased successfully' });
  }

  res.sendStatus(401);
});

app.get("/users/purchasedCourses", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  let verified = validateToken(token);

  if (verified) {
    // get caller's index in USERS[] from (username in) token
    let userIdx = getUserIndex(token);

    return res.json({purchasedCourses: USERS[userIdx].purchasedCourses})
  }

  res.sendStatus(401);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
