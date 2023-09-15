const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { randomUUID } = require("crypto");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
let secret = "dont touch me !";

// verifying users and admins authentication using jwt

const generateJWT = (e) => {
  const encrypted = jwt.sign(e, secret);
  return encrypted;
};

const adminAuth = (req, res, next) => {
  const encryptedData = req.headers.authorization.split(" ")[1];
  console.log("auth : ", encryptedData);
  jwt.verify(encryptedData, secret, (err, decrypted) => {
    if (err) {
      res.send("please login before using this route !");
    } else {
      console.log(decrypted);
      next();
    }
  });
};

const userAuth = (req, res, next) => {
  const encryptedData = req.headers.authorization.split(" ")[1];
  console.log("auth : ", encryptedData);
  jwt.verify(encryptedData, secret, (err, decrypted) => {
    if (err) {
      res.send("please login before using this route !");
    } else {
      console.log(decrypted);
      req.user = encryptedData; // stores the user's username in the req object which can be used the next route call
      next();
    }
  });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = { username, password };
  fs.readFile("./admins.json", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading admins.json file");
    } else {
      let parsedAdmins = JSON.parse(data);
      let adminExists = parsedAdmins.some(
        (admin) => admin.username == username
      );
      if (!adminExists) {
        parsedAdmins.push(admin);
        fs.writeFile(
          "./admins.json",
          JSON.stringify(parsedAdmins),
          "utf8",
          (err) => {
            if (err) {
              res.send("Error while signing up the admin !");
            } else {
              res.send(username + " added to admin.json file");
            }
          }
        );
      } else {
        res.send("Admin " + username + " already Exists !");
      }
    }
  });
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const admin = { username: req.body.username, password: req.body.password };
  fs.readFile("./admins.json", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading admins.json file !");
    } else {
      let parsedAdmins = JSON.parse(data);
      let adminExists = parsedAdmins.some((a) => a.username == admin.username);

      if (adminExists) {
        res.send(admin.username + " logged in succesfully !");
        req.headers.authorization = generateJWT(admin.username);
      } else {
        res.send("error while loggin in !");
      }
    }
  });
});

app.post("/admin/courses", adminAuth, (req, res) => {
  // logic to create a course
  let course = {
    id: randomUUID().slice(0, 2),
    name: req.body.name,
    desc: req.body.desc,
    author: req.body.author,
  };
  fs.readFile("./courses.json", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading courses.json file !");
    } else {
      let parsedCourses = JSON.parse(data);
      let courseExists = parsedCourses.some((c) => c.name == course.name);
      if (!courseExists) {
        parsedCourses.push(course);
        fs.writeFile(
          "./courses.json",
          JSON.stringify(parsedCourses),
          "utf8",
          (err) => {
            if (err) {
              res.send(
                "error while writing courses to the courses.json file !"
              );
            } else {
              res.send("course succesfully added !");
            }
          }
        );
      } else {
        res.send("this course already exists in courses.json file !");
      }
    }
  });
});

app.put("/admin/courses/:courseID", adminAuth, (req, res) => {
  // logic to edit a course
  const ci = req.params.courseID;
  let updatedCourse = {
    id: randomUUID().slice(0, 2),
    name: req.body.name,
    desc: req.body.desc,
    author: req.body.author,
  };
  fs.readFile("./courses.json", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading courses.json file !");
    } else {
      let parsedCourses = JSON.parse(data);
      let courseId = parsedCourses.findIndex((c) => c.id == ci);
      if (courseId > 0) {
        parsedCourses[courseId] = updatedCourse;
        fs.writeFile(
          "./courses.json",
          JSON.stringify(parsedCourses),
          "utf8",
          (err) => {
            if (err) {
              res.send(
                "error while updated courses to the courses.json file !"
              );
            } else {
              res.send("course updated added !");
            }
          }
        );
      } else {
        res.send("course with this id does not exist in courses.json !");
      }
    }
  });
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  fs.readFile("./courses.json", "utf8", (err, data) => {
    if (err) {
      res.send("cant read the file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = { username, password };
  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading admins.json file");
    } else {
      let parsedUsers = JSON.parse(data);
      let userExists = parsedUsers.some((user) => user.username == username);
      if (!userExists) {
        parsedUsers.push(user);
        fs.writeFile(
          "./users.json",
          JSON.stringify(parsedUsers),
          "utf8",
          (err) => {
            if (err) {
              res.send("Error while signing up the user !");
            } else {
              res.send(username + " added to users.json file");
            }
          }
        );
      } else {
        res.send("user " + username + " already Exists !");
      }
    }
  });
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const user = { username: req.body.username, password: req.body.password };
  fs.readFile("./users.json", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading users.json file !");
    } else {
      let parsedUsers = JSON.parse(data);
      let adminExists = parsedUsers.some((a) => a.username == user.username);

      if (adminExists) {
        res.send(user.username + " logged in succesfully !");
        req.user = user;
        req.headers.authorization = generateJWT(user.username);
      } else {
        res.send("error while loggin in !");
      }
    }
  });
});

app.get("/users/courses", userAuth, (req, res) => {
  // logic to list all courses
  fs.readFile("./courses", "utf8", (err, data) => {
    if (err) {
      res.send("error while reading courses.json file !");
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post("/users/courses/:courseId", (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get("/users/purchasedCourses", (req, res) => {
  // logic to view purchased courses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
