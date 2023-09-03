const express = require("express");
const fs = require("node:fs");
const jwt = require("jsonwebtoken");

const ADMIN_AUTH_KEY = "Gin echimaru";
const USER_AUTH_KEY = "Menos grande";

const app = express();

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// gen jwt token
const genAdminJwt = (admin) => {
  const payload = admin.username;
  const token = jwt.sign(payload, ADMIN_AUTH_KEY, { expiresIn: "1hr" });
};
const genUserJwt = (user) => {
  const payload = user.username;
  const token = jwt.sign(payload, USER_AUTH_KEY, { expiresIn: "1hr" });
  return token;
};
// Authentication
const adminJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  json.verify(token, ADMIN_AUTH_KEY, (err, admin) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.admin = admin;
    next();
  });
};
const userJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.sendStatus(401);
  }
  const token = authHeader.split(" ")[1];
  json.verify(token, USER_AUTH_KEY, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

const getFileData = (fileName, callback) => {
  fs.readFile(fileName, "utf-8", (err, fileData) => {
    if (err) {
      console.error(err);
      callback([]);
    } else {
      try {
        const data = JSON.parse(fileData);
        callback(data);
      } catch (err) {
        console.error("Error parsing file data:", err);
        callback([]);
      }
    }
  });
};

const writeFile = (fileName, data, callback) => {
  fs.writeFile(fileName, JSON.stringify(data), (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      callback(err);
    }
    if (callback) {
      callback();
    }
  });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  if (!admin) {
  }
  getFileData("admins.json", (admins) => {
    const adminExists = admins.find((a) => a.username === admin.username);
    if (adminExists) {
      res.send(403).json({ message: "Admin already exists" });
    } else {
      admins.push(admin);
      writeFile("admins.json", admins, (err) => {
        if (err) {
          return res.status(500);
        }
        const token = genAdminJwt(admin);
        res.json({ message: "Admin created successfully", token });
      });
    }
  });
});

app.post("/admin/login", (req, res) => {
  const { username, password } = req.headers;
  if (!username) {
    return res.sendStatus(401);
  }
  getFileData("admin.json", (admins) => {
    const adminExists = admins.find(
      (a) => a.username === username && a.password === password
    );
    if (!adminExists) {
      return res.status(403).json({ message: "Admin not found" });
    }
    const token = genAdminJwt({ username });
    res.json({ message: "Admin created successfully", token });
  });
});

app.post("/admin/courses", adminJwtAuth, (req, res) => {
  getFileData("courses.json", (data) => {
    const courses = JSON.parse(data).push(req.body);
    writeFile("couruses.json", JSON.stringify(courses), (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.json({ message: "Course created successfully" });
    });
  });
});

app.put("/admin/courses/:courseId", adminJwtAuth, (req, res) => {
  const courseId = req.params.courseId;
  getFileData("courses.json", (data) => {
    const courses = JSON.parse(data);
    const idx = courses.findIndex((course) => course.id === courseId);
    courses[idx] = req.body;
    writeFile("courses.json", JSON.stringify(courses), (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.json({ message: "Course updated successfully" });
    });
  });
});

app.get("/admin/courses", (req, res) => {
  getFileData("courses.json", (course) => {
    res.json({ course });
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
});

app.post("/users/login", (req, res) => {
  // logic to log in user
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
