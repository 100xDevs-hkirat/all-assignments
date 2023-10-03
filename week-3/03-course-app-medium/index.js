const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

app.use(express.json());

const adminPath = path.join(__dirname, "admins.json");
const coursePath = path.join(__dirname, "courses.json");
const userPath = path.join(__dirname, "users.json");

const key = "no-secret";

const generateToken = (user) => {
  const payload = { username: user.username };
  const token = jwt.sign(payload, key, { expiresIn: "1h" });
  return token;
};

const userAuthentication = (req, res, next) => {
  const auth = req.headers.authorization;
  if (auth) {
    const token = auth.split(" ")[1];
    jwt.verify(token, key, (err, user) => {
      if (err) {
        res.status(403).json({ message: "Authentication failed" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(403).json({ message: " user authentication succefull" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  fs.readFile(adminPath, "utf-8", (err, data) => {
    if (err) {
      res.status(403).json({ message: "error reading adminFile " });
      return;
    }
    const adminData = JSON.parse(data);
    const admin = req.body;
    const existingAdmin = adminData.find((a) => a.username === admin.username);
    if (existingAdmin) {
      res.status(403).json({ message: "admin already exist" });
    } else {
      adminData.push(admin);
    }
    fs.writeFile(adminPath, JSON.stringify(adminData), "utf-8", (err) => {
      if (err) {
        console.error(err);
      } else {
        const token = generateToken(adminData);
        res.json({ message: "admin created succefully", token });
      }
    });
  });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  fs.readFile(adminPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    }

    const adminData = JSON.parse(data);
    const admin = req.headers;
    const existingAdmin = adminData.find(
      (a) => a.username === admin.username && a.password === admin.password
    );
    if (existingAdmin) {
      const token = generateToken(existingAdmin);
      res.json({ message: "admin logged in successfully", token });
    } else {
      res.status(403).json({ message: " admin not found " });
    }
  });
});

app.post("/admin/courses", userAuthentication, (req, res) => {
  // logic to create a course
  fs.readFile(coursePath, "utf-8", (err, data) => {
    if (err) {
      res.status(403).json({ message: "course read error" });
    }
    const courses = JSON.parse(data);
    const courseToCreate = req.body;
    courses.push(courseToCreate);
    fs.writeFile(coursePath, JSON.stringify(courses), (err) => {
      if (err) {
        console.error(err);
      }
      res.json({ message: "course created successfully" });
    });
  });
});

app.put("/admin/courses/:courseId", userAuthentication, (req, res) => {
  // logic to edit a course
  fs.readFile(coursePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500);
      json({ message: "Internal server error" });
      return;
    }
    const courses = JSON.parse(data);
    const courseId = parseInt(req.params.courseId);
    const courseIndex = courses.findIndex((a) => a.courseId === courseId);
    if (courseIndex !== -1) {
      const updatedCourses = req.body;
      courses[courseIndex] = updatedCourses;
      fs.writeFile(coursePath, JSON.stringify(courses), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ message: "Internal server error" });
          return;
        }
        res.json({ message: "course updated successfullly" });
      });
    } else {
      res.status(403).json({ message: "course not found" });
    }
  });
});

app.get("/admin/courses", userAuthentication, (req, res) => {
  // logic to get all courses

  fs.readFile(coursePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).message({ message: "internal server error " });
    }
    const courses = JSON.parse(data);

    res.send({ course: courses });
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  fs.readFile(userPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
      return;
    }
    const users = JSON.parse(data);
    const user = req.body;
    const existingUser = users.find((a) => a.username === user.username);
    if (existingUser) {
      res.status(403).json({ message: " user already exists." });
    } else {
      users.push(user);
    }
    const token = generateToken(user);

    fs.writeFile(userPath, JSON.stringify(users), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
        return;
      }
      res.json({ message: "user sign up succefully", token });
    });
  });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  fs.readFile(userPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: "internal server error" });
      return;
    }
    const userData = JSON.parse(data);
    const user = req.headers;
    const existingUser = userData.find(
      (a) => a.username === user.username && a.password === user.password
    );
    if (existingUser) {
      const token = generateToken(existingUser);
      res.json({ message: "User loggedin successfully", token });
    } else {
      res.status(403).json({ message: "user not found" });
    }
  });
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  // logic to purchase a course
  fs.readFile(coursePath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    }
    const courses = JSON.parse(data);
    const courseID = parseInt(req.params.courseId);
    const findCourse = courses.find((a) => a.courseid === courseID);
    if (findCourse) {
      fs.readFile(userPath, "utf-8", (err, data) => {
        if (err) {
          console.error(err);
        }
        const users = JSON.parse(data);
        const user = users.find((a) => a.username === req.user.username);
        if (user) {
          if (!user.purchasedCourses) {
            user.purchasedCourses = [];
          }
          user.purchasedCourses.push(findCourse);
          fs.writeFile(userPath, JSON.stringify(users), (err) => {
            if (err) {
              console.error(err);
            }
            res.json({ message: "course purchased successfully" });
          });
        }
      });
    } else {
      res.status(403).json({ message: "course not found" });
    }
  });
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  fs.readFile(userPath, "utf-8", (err, data) => {
    if (err) {
      console.error(err);
    }
    const users = JSON.parse(data);

    const user = users.find((a) => a.username === req.user.username);
    if (user && user.purchasedCourses) {
      res.json({ purchasedCourses: user.purchasedCourses });
    } else {
      res.status(403).json({ message: "user or course not found" });
    }
  });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
