const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

let secret = "CourseMedium";

function generatejwt(payload) {
  let token = jwt.sign({ username: payload.username, id: payload.id }, secret, {
    expiresIn: "10h",
  });
  return token;
}

function authenticateJwt(req, res, next) {
  let authheader = req.headers.authorization;
  if (authheader) {
    let token = authheader.split(" ")[1];
    try {
      const user = jwt.verify(token, secret);
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({
        message: "invalid token",
      });
    }
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  let { firstname, username, password } = req.body;
  fs.readFile("admins.json", "utf-8", (err, data) => {
    if (err) throw err;
    let admins = JSON.parse(data);
    let existingAdmin = admins.find(
      a => a.username == username && a.password == password
    );
    if (existingAdmin) {
      res.status(403).json({
        message: "Admin already exists",
        success: false,
      });
    } else {
      let admin = {
        id: Math.floor(Math.random() * 10000),
        firstname: firstname,
        username: username,
        password: password,
        createdAt: new Date(),
      };
      admins.push(admin);
      fs.writeFile("admins.json", JSON.stringify(admins), err => {
        if (err) throw err;
        let token = generatejwt(admin);
        res.status(201).json({
          message: "Admin created successfully",
          success: true,
          token: token,
          data: admin,
        });
      });
    }
  });

  // let admins =
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  console.log(req.body);
  let username = req.body.email;
  const { password } = req.body;
  console.log(username);
  fs.readFile("admins.json", "utf-8", (err, data) => {
    if (err) throw err;
    let admins = JSON.parse(data);
    console.log(admins);
    let existingAdmin = admins.find(
      a => a.username == username && a.password == password
    );
    console.log(existingAdmin);
    if (existingAdmin) {
      let token = generatejwt(existingAdmin);
      res.status(200).json({
        message: "Logged in successfully",
        success: true,
        token: token,
      });
    } else {
      res.status(403).json({
        message: "Invaild username or password",
        success: false,
      });
    }
  });
});

app.get("/admin/me", authenticateJwt, (req, res) => {
  res.status(200).json({
    username: req.user.username,
    success: true,
  });
});

app.post("/admin/courses", authenticateJwt, (req, res) => {
  // logic to create a course
  console.log(req.body);
  let course = {
    title: req.body.title,
    description: req.body.description,
    price: req.body.price,
    imageLink: req.body.imageLink,
    published: req.body.published,
    courseId: Math.floor(Math.random() * 12000),
  };
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }

    let courses = JSON.parse(data);
    courses.push(course);
    fs.writeFile("courses.json", JSON.stringify(courses), "utf-8", err => {
      if (err) {
        throw err;
      }
      res.status(201).json({
        message: "Course created successfully",
        success: true,
        courseId: course.courseId,
      });
    });
  });
});

app.put("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to edit a course
  let courseId = req.params.courseId;
  // console.log(req.body);
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    let courses = JSON.parse(data);
    let courseIndex = courses.findIndex(i => i.courseId == courseId);
    // console.log(courseIndex);
    if (courseIndex !== -1) {
      let updatedCourse = { ...courses[courseIndex], ...req.body };
      courses[courseIndex] = updatedCourse;
      // console.log(courses);
      fs.writeFile("courses.json", JSON.stringify(courses), err => {
        if (err) {
          throw err;
        }
        res.status(200).json({
          message: "Course updated successfully",
          success: true,
        });
      });
    } else {
      res.status(404).json({
        message: "course does'nt exists",
        success: false,
      });
    }
  });
});

app.get("/admin/courses/:courseId", (req, res) => {
  try {
    console.log("hello world");
    let courseId = req.params.courseId;
    console.log(courseId);
    fs.readFile("courses.json", "utf-8", (err, data) => {
      if (err) throw err;
      let courses = JSON.parse(data);
      let course = courses.find(course => course.courseId == courseId);
      if (course) {
        res.status(200).json({
          message: "Successfully fetched a course",
          success: true,
          course: course,
        });
      } else {
        res.status(200).json({
          message: "Course does'nt exists",
          success: false,
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
});

app.delete("/admin/courses/:courseId", authenticateJwt, (req, res) => {
  try {
    let courseId = req.params.courseId;
    // console.log(courseId);
    fs.readFile("courses.json", "utf-8", (err, data) => {
      if (err) throw err;
      let courses = JSON.parse(data);
      // console.log(courses);
      let newCourses = courses.filter(course => {
        return course.courseId != courseId;
      });
      // console.log(newCourses);
      fs.writeFile("courses.json", JSON.stringify(newCourses), err => {
        if (err) {
          throw err;
        }

        res.status(200).json({
          message: "Successfully deleted a courses",
          success: true,
          courseId: courseId,
        });
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Something went wrong",
      success: false,
    });
  }
});

app.get("/admin/courses", authenticateJwt, (req, res) => {
  // logic to get all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    let courses = JSON.parse(data);
    res.status(200).json({
      courses: courses,
    });
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  let { username, password } = req.body.body;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    let existingUser = users.find(
      a => a.username == username && a.password == password
    );
    if (existingUser) {
      res.status(403).json({
        message: "User already exists",
        success: false,
      });
    } else {
      let user = {
        id: Math.floor(Math.random() * 10000),
        username: username,
        password: password,
        createdAt: new Date(),
      };
      users.push(user);
      fs.writeFile("users.json", JSON.stringify(users), err => {
        if (err) throw err;
        let token = generatejwt(user);
        res.status(201).json({
          message: "Admin created successfully",
          success: true,
          token: token,
        });
      });
    }
  });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  let { username, password } = req.body.body;
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    let existingUser = users.find(
      a => a.username == username && a.password == password
    );
    if (existingUser) {
      let token = generatejwt(existingUser);
      res.status(200).json({
        message: "Logged in successfully",
        success: true,
        token: token,
      });
    } else {
      res.status(403).json({
        message: "Invaild username or password",
        success: false,
      });
    }
  });
});

app.get("/users/courses", authenticateJwt, (req, res) => {
  // logic to list all courses
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) {
      throw err;
    }
    let courses = JSON.parse(data);
    res.status(200).json({
      courses: courses,
    });
  });
});

app.post("/users/courses/:courseId", authenticateJwt, (req, res) => {
  // logic to purchase a course
  let courseId = req.params.courseId;
  fs.readFile("courses.json", "utf-8", (err, data) => {
    if (err) throw err;
    let courses = JSON.parse(data);
    let course = courses.find(c => c.courseId == courseId);
    if (course) {
      fs.readFile("users.json", "utf-8", (err, userData) => {
        if (err) throw err;
        let users = JSON.parse(userData);
        let user = users.find(
          u => u.username == req.user.username && u.id == req.user.id
        );
        if (user) {
          if (!user.purchasedcourses) {
            user.purchasedcourses = [];
            console.log(user);
          }
          user.purchasedcourses.push(course);
          fs.writeFile("users.json", JSON.stringify(users), err => {
            if (err) throw err;
            res.status(200).json({
              message: "course purchased successfully",
              success: true,
            });
          });
        } else {
          res.status(403).json({
            message: "user not found",
            success: false,
          });
        }
      });
    } else {
      res.status(403).json({
        message: "course not found",
        success: false,
      });
    }
  });
});

app.get("/users/purchasedCourses", authenticateJwt, (req, res) => {
  // logic to view purchased courses
  fs.readFile("users.json", "utf-8", (err, data) => {
    if (err) throw err;
    let users = JSON.parse(data);
    let user = users.find(
      u => u.username == req.user.username && u.id == req.user.id
    );
    console.log(user.id);
    console.log(user.purchasedCourses);
    if (user) {
      res.status(200).json({
        purchasedCourses: user.purchasedCourses,
        success: true,
      });
    } else {
      res.status(403).json({
        message: "user not found",
        success: false,
      });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
