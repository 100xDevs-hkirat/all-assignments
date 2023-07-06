const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
function createId() {
  return Date.now();
}
function authUser(req, res, next) {
  let userName = req.headers.username;
  let password = req.headers.password;
  let existingUser = USERS.find((user) => {
    return user.username === userName;
  });
  if (existingUser) {
    if (existingUser.password === password) {
      req.user = existingUser;
      next();
    } else {
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(404);
  }
}
function authAdmin(req, res, next) {
  let userName = req.headers.username;
  let password = req.headers.password;
  let existingAdmin = ADMINS.find((admin) => {
    return admin.username === userName;
  });
  if (existingAdmin) {
    if (existingAdmin.password === password) {
      req.admin = existingAdmin;
      next();
    } else {
      return res.sendStatus(401);
    }
  } else {
    return res.sendStatus(404);
  }
}
// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  let userName = req.body.username;
  let password = req.body.password;
  let existingAdmin = ADMINS.find((admin) => {
    return admin.username === userName;
  });
  if (existingAdmin) {
    return res.sendStatus(403);
  } else {
    ADMINS.push({
      id: createId,
      username: userName,
      password: password,
    });
  }
  return res.status(200).json({ message: "Admin created successfully" });
});

app.post("/admin/login", authAdmin, (req, res) => {
  // logic to log in admin
  res.status(200).json({ message: "Logged in successfully" });
});

app.post("/admin/courses", authAdmin, (req, res) => {
  // logic to create a course
  let course = req.body;
  course.id = createId();
  COURSES.push(course);
  return res
    .status(200)
    .json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authAdmin, (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  let course = COURSES.find((course) => {
    return parseInt(course.id) === parseInt(courseId);
  });
  if (course) {
    Object.assign(course, req.body);
    // course.id = courseId;
  } else {
    return res.sendStatus(404);
  }
  return res.json({ message: "Course updated successfully" });
});

app.get("/admin/courses", authAdmin, (req, res) => {
  // logic to get all courses
  return res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let userName = req.body.username;
  let password = req.body.password;
  let existingUser = USERS.find((user) => {
    return user.username === userName;
  });
  if (existingUser) {
    return res.sendStatus(409);
  } else {
    USERS.push({
      id: createId(),
      username: userName,
      password: password,
      purchasedCourses: [],
    });
    res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", authUser, (req, res) => {
  // logic to log in user
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", authUser, (req, res) => {
  // logic to list all courses
  let filteredCourses = COURSES.filter((c) => {
    return c.published;
  });
  res.json({
    courses: filteredCourses,
  });
});

app.post("/users/courses/:courseId", authUser, (req, res) => {
  // logic to purchase a course
  let courseId = parseInt(req.params.courseId);

  let coursePurchased = COURSES.find((fc) => {
    return parseInt(fc.id) === parseInt(courseId) && fc.published;
  });
  if (coursePurchased) {
    // Object.assign(user,{purchasedCourses:user.purchasedCourses.push(coursePurchased)})
    req.user.purchasedCourses.push(coursePurchased.id);
    return res.json({ message: "Course purchased successfully" });
  } else {
    return res
      .status(404)
      .json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", authUser, (req, res) => {
  // logic to view purchased courses
  let purchasedCourses = req.user.purchasedCourses;
  let filteredCourses = [];
  purchasedCourses.forEach((element) => {
    COURSES.forEach((c) => {
      if (parseInt(c.id) === element) {
        filteredCourses.push(c);
      }
    });
  });
  return res.json({ purchasedCourses: filteredCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
