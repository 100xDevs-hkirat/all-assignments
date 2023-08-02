// const express = require('express');
// const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const app = express();

// app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// // Read data from file, or initialize to empty array if file does not exist
// try {
//     ADMINS = JSON.parse(fs.readFileSync('admins.json', 'utf8'));
//     USERS = JSON.parse(fs.readFileSync('users.json', 'utf8'));
//     COURSES = JSON.parse(fs.readFileSync('courses.json', 'utf8'));
// } catch {
//     ADMINS = [];
//     USERS = [];
//     COURSES = [];
// }
// console.log(ADMINS);

// const SECRET = 'my-secret-key';

// const authenticateJwt = (req, res, next) => {
//   const authHeader = req.headers.authorization;
//   if (authHeader) {
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, SECRET, (err, user) => {
//       if (err) {
//         return res.sendStatus(403);
//       }
//       req.user = user;
//       next();
//     });
//   } else {
//     res.sendStatus(401);
//   }
// };

// // Admin routes
// app.post('/admin/signup', (req, res) => {
//   const { username, password } = req.body;
//   const admin = ADMINS.find(a => a.username === username);
//   console.log("admin signup");
//   if (admin) {
//     res.status(403).json({ message: 'Admin already exists' });
//   } else {
//     const newAdmin = { username, password };
//     ADMINS.push(newAdmin);
//     fs.writeFileSync('admins.json', JSON.stringify(ADMINS));
//     const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Admin created successfully', token });
//   }
// });

// app.post('/admin/login', (req, res) => {
//   const { username, password } = req.headers;
//   const admin = ADMINS.find(a => a.username === username && a.password === password);
//   if (admin) {
//     const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Logged in successfully', token });
//   } else {
//     res.status(403).json({ message: 'Invalid username or password' });
//   }
// });

// app.post('/admin/courses', authenticateJwt, (req, res) => {
//   const course = req.body;
//   course.id = COURSES.length + 1;
//   COURSES.push(course);
//   fs.writeFileSync('courses.json', JSON.stringify(COURSES));
//   res.json({ message: 'Course created successfully', courseId: course.id });
// });

// app.put('/admin/courses/:courseId', authenticateJwt, (req, res) => {
//   const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
//   if (course) {
//     Object.assign(course, req.body);
//     fs.writeFileSync('courses.json', JSON.stringify(COURSES));
//     res.json({ message: 'Course updated successfully' });
//   } else {
//     res.status(404).json({ message: 'Course not found' });
//   }
// });

// app.get('/admin/courses', authenticateJwt, (req, res) => {
//   res.json({ courses: COURSES });
// });

// // User routes
// app.post('/users/signup', (req, res) => {
//   const { username, password } = req.body;
//   const user = USERS.find(u => u.username === username);
//   if (user) {
//     res.status(403).json({ message: 'User already exists' });
//   } else {
//     const newUser = { username, password };
//     USERS.push(newUser);
//     fs.writeFileSync('users.json', JSON.stringify(USERS));
//     const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
//     res.json({ message: 'User created successfully', token });
//   }
// });

// app.post('/users/login', (req, res) => {
//   const { username, password } = req.headers;
//   const user = USERS.find(u => u.username === username && u.password === password);
//   if (user) {
//     const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
//     res.json({ message: 'Logged in successfully', token });
//   } else {
//     res.status(403).json({ message: 'Invalid username or password' });
//   }
// });

// app.get('/users/courses', authenticateJwt, (req, res) => {
//   res.json({ courses: COURSES });
// });

// app.post('/users/courses/:courseId', authenticateJwt, (req, res) => {
//   const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
//   if (course) {
//     const user = USERS.find(u => u.username === req.user.username);
//     if (user) {
//       if (!user.purchasedCourses) {
//         user.purchasedCourses = [];
//       }
//       user.purchasedCourses.push(course);
//       fs.writeFileSync('users.json', JSON.stringify(USERS));
//       res.json({ message: 'Course purchased successfully' });
//     } else {
//       res.status(403).json({ message: 'User not found' });
//     }
//   } else {
//     res.status(404).json({ message: 'Course not found' });
//   }
// });

// app.get('/users/purchasedCourses', authenticateJwt, (req, res) => {
//   const user = USERS.find(u => u.username === req.user.username);
//   if (user) {
//     res.json({ purchasedCourses: user.purchasedCourses || [] });
//   } else {
//     res.status(403).json({ message: 'User not found' });
//   }
// });

// app.listen(3000, () => console.log('Server running on port 3000'));

// my try

const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

try {
  ADMINS = JSON.parse(readFileSync("admins.json", "utf8"));
  USERS = JSON.parse(readFileSync("users.json", "utf8"));
  COURSES = JSON.parse(readFileSync("courses.json", "utf8"));
} catch {
  ADMINS = [];
  USERS = [];
  COURSES = [];
}

const SECRET_KEY_ADMIN = "ac1m1n";
const SECRET_KEY_USER = "us3r";

// authentication middleware for user

const authUserJwt = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, SECRET_KEY_USER, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).json({ message: "No token provided" });
  }
};

// authentication middleware for admin

const authAdminJwt = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (authHeaders) {
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, SECRET_KEY_ADMIN, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.status(403).json({ message: "No token provided" });
  }
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const admin = req.body;
  const adminFound = ADMINS.find(
    (eachAdmin) => eachAdmin.username === admin.username
  );
  if (adminFound) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    fs.writeFileSync("admins.json", JSON.stringify(ADMINS));
    const token = jwt.sign(
      { username: admin.username, role: "admin" },
      SECRET_KEY_ADMIN,
      { expiresIn: "1h" }
    );
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(
    (eachAdmin) =>
      eachAdmin.username === username && eachAdmin.password === password
  );
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRET_KEY_ADMIN, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.post("/admin/courses", authAdminJwt, (req, res) => {
  // logic to create a course
  const course = req.body;
  course.id = COURSES.length + 1;
  COURSES.push(course);
  fs.writeFileSync("courses.json", JSON.stringify(COURSES));
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authAdminJwt, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const courseIndex = COURSES.findIndex(
    (eachCourse) => eachCourse.id === courseId
  );
  if (courseIndex > -1) {
    const newCourse = { ...COURSES[courseIndex], ...req.body };
    COURSES[courseIndex] = newCourse;
    fs.writeFileSync("courses.json", JSON.stringify(COURSES));
    res.json({
      message: "Course updated successfully",
    });
  } else {
    res.status(404).json({ message: "Course not found" });
  }

  /*or
    const course = COURSES.find(eachCourse => eachCourse.id === courseId);
    if (course) {
      Object.assign(course, req.body);
      fs.writeFileSync("courses.json", JSON.stringify(COURSES));
      res.json({ message: "Course updated successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  */
});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body;
  const userFound = USERS.find(
    (eachUser) =>
      eachUser.username === user.username && eachUser.password === user.password
  );

  if (userFound) {
    res.status(403).json({ message: "User already exists" });
  } else {
    USERS.push(user);
    fs.writeFileSync("users.json", JSON.stringify(USERS));
    const token = jwt.sign(
      { username: user.username, role: "user" },
      SECRET_KEY_USER,
      { expiresIn: "1h" }
    );
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(
    (eachUser) =>
      eachUser.username === username && eachUser.password === password
  );
  if (user) {
    const token = jwt.sign(
      { username: username, role: "user" },
      SECRET_KEY_USER,
      { expiresIn: "1h" }
    );
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.get("/users/courses", authUserJwt, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.filter((eachCourse) => eachCourse.published) });
});

app.post("/users/courses/:courseId", authUserJwt, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find((eachCourse) => eachCourse.id === courseId);
  if (course) {
    const user = USERS.find(
      (eachUser) => eachUser.username === req.user.username
    );
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      } else {
        user.purchasedCourses.push(course);
        fs.writeFileSync("users.json", JSON.stringify(USERS));
        res.json({ message: "Course purchased successfully" });
      }
    } else {
      res.status(403).json({ message: "Invalid user" });
    }
  } else {
    res.status(403).json({ message: "Invalid course" });
  }
});

app.get("/users/purchasedCourses", authUserJwt, (req, res) => {
  // logic to view purchased courses
  const user = USERS.find(
    (eachUser) => eachUser.username === req.user.username
  );
  if (user) {
    res.json({ courses: user.purchasedCourses });
  } else {
    res.status(403).json({ message: "Invalid user" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
