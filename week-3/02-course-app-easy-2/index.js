const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let COURSE_PURCHASES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  var newAdmin = req.body;
  if (adminAuthentication(newAdmin)) {
    return res.status(403);
  } else {
    const jstoken = jwt.sign({ username: newAdmin.username }, "da-sekret-key", {
      expiresIn: "1h",
    });

    ADMINS.push(newAdmin);

    res
      .status(200)
      .json({ message: "Admin created successfully", token: jstoken });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const admin = req.headers;
  if (adminAuthentication(admin)) {
    const jstoken = jwt.sign({ username: admin.username }, "da-sekret-key", {
      expiresIn: "1h",
    });

    return res
      .json({ message: "Logged in successfully", token: jstoken })
      .status(200);
  } else return res.status(403);
});

app.post("/admin/courses", authenticationAdmin, (req, res) => {
  // logic to create a course
  let newCourse = req.body;
  newCourse.id = generateUniqueID();
  COURSES.push(newCourse);
  return res.json({
    message: "Course created successfully",
    courseId: newCourse.id,
  });
});

app.put("/admin/courses/:courseId", authenticationAdmin, (req, res) => {
  // logic to edit a course
  let index = COURSES.findIndex((c) => c.id === req.params.id);
  if (index == -1) {
    return res.send(404);
  } else {
    COURSES[index] = req.body;
    res.status(200).json({ message: "Course updated successfully" });
  }
});

app.get("/admin/courses", authenticationAdmin, (req, res) => {
  // logic to get all courses
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(COURSES)).status(200);
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let newUser = req.body;
  if (userAuthentication(newUser)) {
    return res.status(403);
  } else {
    const jstoken = jwt.sign({ username: newUser.username }, "da-sekret-key", {
      expiresIn: "1h",
    });

    USERS.push(newUser);
    res
      .status(200)
      .json({ message: "User created successfully", token: jstoken });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const user = req.headers;
  if (userAuthentication(user)) {
    const jstoken = jwt.sign({ username: user.username }, "da-sekret-key", {
      expiresIn: "1h",
    });

    return res
      .json({ message: "Logged in successfully", token: jstoken })
      .status(200);
  } else return res.status(403);
});

app.get("/users/courses", authenticateUser, (req, res) => {
  // logic to list all courses
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(COURSES)).status(200);
});

app.post("/users/courses/:courseId", authenticateUser, (req, res) => {
  // logic to purchase a course
  if (courseExists(req.params.courseId)) {
    let index = COURSES.findIndex((c) => c.id === req.params.courseId);
    let purchaseDetail = {
      username: req.body.username,
      courseDeets: COURSES[index],
    };
    COURSE_PURCHASES.push(purchaseDetail);
    res.json({ message: "Course purchased successfully" });
  }
});

app.get("/users/purchasedCourses", authenticateUser, (req, res) => {
  // logic to view purchased courses
  let serchResult = [];
  for (let i = 0; i < COURSE_PURCHASES; i++) {
    if (COURSE_PURCHASES[i].username === req.headers.username) {
      serchResult.push(COURSE_PURCHASES[i].courseDeets);
    }
  }
  return res.json(serchResult);
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

// //returns true is admin exists
// function adminAuthentication(details) {
//   for (var i = 0; i < ADMINS.length; i++) {
//     if (
//       ADMINS[i].username == details.username &&
//       ADMINS[i].password == details.password
//     )
//       return true;
//   }

//   return false;
// }
// middleware to authenticate admin
function authenticationAdmin(req, res, next) {
  const tokenRecieved = req.headers.Authorization;

  if (!tokenRecieved) {
    return res.json({ message: "Unauthorized Access" }).status(401);
  }

  jwt.verify(tokenRecieved, "da-sekret-key", (err, decoded) => {
    if (err) {
      return res.status(403);
    }

    req.body = decoded;

    next();
  });
}

// //returns true is user exists
// function userAuthentication(details) {
//   for (var i = 0; i < USERS.length; i++) {
//     if (
//       USERS[i].username == details.username &&
//       USERS[i].password == details.password
//     )
//       return true;
//   }

//   return false;
// }

// middleware to authenticate user
function authenticateUser(req, res, next) {
  const tokenRecieved = req.headers.Authorization;
  if (!tokenRecieved) {
    return res.status(403);
  }

  jwt.verify(tokenRecieved, "da-sekret-key", (err, decoded) => {
    if (err) {
      return res.status(403);
    }

    req.body = decoded;
    next();
  });
}

//generates a unique id
function generateUniqueID() {
  return Math.floor(Math.random() * 900000) + 100000;
}

//returns true if course with given id exists
function courseExists(ID) {
  for (let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].id === ID) return true;
  }
  return false;
}
