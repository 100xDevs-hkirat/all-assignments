const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const app = express();
const SECRET = "it's a super secret String";
app.use(express.json());

let ADMINS = JSON.parse(
  fs.readFileSync("./admin.json", { encoding: "utf8", flag: "r" })
);
let USERS = JSON.parse(
  fs.readFileSync("./user.json", { encoding: "utf8", flag: "r" })
);
let COURSES = JSON.parse(
  fs.readFileSync("./courses.json", {
    encoding: "utf8",
    flag: "r",
  })
);
function createId() {
  return Date.now();
}
function generateJwt(user) {
  if (user) {
    return jwt.sign(user, SECRET);
  }
}
function checkToken(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    authHeader = authHeader.split(" ")[1];
    jwt.verify(authHeader, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(401);
      } else {
        req.user = user;
        next();
      }
    });
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
    const admin = {
      id: createId(),
      username: userName,
      password: password,
    };
    ADMINS.push(admin);
  }
  fs.writeFile("./admin.json", JSON.stringify(ADMINS), (err) => {
    if (err) res.status(404).send("No File Found");
  });
  return res.status(200).json({ message: "Admin created successfully" });
});

app.post("/admin/login", (req, res) => {
  let userName = req.headers.username;
  let password = req.headers.password;
  let existingAdmin = ADMINS.find((admin) => {
    return admin.username === userName;
  });
  if (existingAdmin && existingAdmin.password === password) {
    const token = generateJwt({
      username: userName,
    });
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.sendStatus(400);
  }
  // logic to log in admin
});

app.post("/admin/courses", checkToken, (req, res) => {
  // logic to create a course
  let course = req.body;
  course.id = createId();
  COURSES.push(course);
  fs.writeFile("./courses.json", JSON.stringify(COURSES), (err) => {
    if (err) res.status(404).send("No File Found");
  });
  return res
    .status(200)
    .json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", checkToken, (req, res) => {
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
  fs.writeFile("./courses.json", JSON.stringify(COURSES), (err) => {
    if (err) res.status(404).send("No File Found");
  });
  return res.json({ message: "Course updated successfully" });
});

app.get("/admin/courses", checkToken, (req, res) => {
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
    let user = {
      id: createId(),
      username: userName,
      password: password,
      purchasedCourses: [],
    };
    USERS.push(user);
    fs.writeFile("./user.json", JSON.stringify(USERS), (err) => {
      if (err) res.status(404).send("No File Found");
    });
    return res.json({ message: "User created successfully" });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  let userName = req.headers.username;
  let password = req.headers.password;
  let existingUser = USERS.find((user) => {
    return user.username === userName;
  });
  if (existingUser && existingUser.password === password) {
    const token = generateJwt({
      username: userName,
    });
    res.status(200).json({ message: "Logged in successfully", token });
  } else {
    res.sendStatus(400);
  }
});

app.get("/users/courses", checkToken, (req, res) => {
  // logic to list all courses
  let filteredCourses = COURSES.filter((c) => {
    return c.published;
  });
  res.json({
    courses: filteredCourses,
  });
});

app.post("/users/courses/:courseId", checkToken, (req, res) => {
  // logic to purchase a course
  let courseId = parseInt(req.params.courseId);

  let coursePurchased = COURSES.find((fc) => {
    return parseInt(fc.id) === parseInt(courseId) && fc.published;
  });
  if (coursePurchased) {
    // Object.assign(user,{purchasedCourses:user.purchasedCourses.push(coursePurchased)})
    let user = USERS.find((u) => {
      return u.username === req.user.username;
    });
    user.purchasedCourses.push(coursePurchased.id);
    fs.writeFile("./user.json", JSON.stringify(USERS), (err) => {
      if (err) res.status(404).send("No File Found");
    });
    return res.json({ message: "Course purchased successfully" });
  } else {
    return res
      .status(404)
      .json({ message: "Course not found or not available" });
  }
});

app.get("/users/purchasedCourses", checkToken, (req, res) => {
  // logic to view purchased courses
  let user = USERS.find((u) => {
    return u.username === req.user.username;
  });
  let purchasedCourses = user.purchasedCourses;
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
