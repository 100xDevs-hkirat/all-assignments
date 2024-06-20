const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  // logic to log in admin
  let username = req.headers.username;
  let password = req.headers.password;

  // checks if the user name is valid and get user object
  let user = ADMINS.find((usr) => {
    return usr.username === username;
  });

  if (!user) {
    return res.status(401).json({ message: "username or password incorrect." });
  }
  bcrypt.compare(password, user.password).then(function (result) {
    if (result) {
      req.user = user;
      return next();
    } else {
      return res.json({ message: "username or password incorrect" });
    }
  });
};

// user authentication middleware
const authenticateUser = (req, res, next) => {
  let username = req.headers.username;
  let password = req.headers.password;

  // find the corresponding user
  let user = USERS.find((usr) => usr.username === username);

  if (!user) {
    return res.status(403).json({ message: "username or password invalid" });
  }

  bcrypt
    .compare(password, user.password)
    .then((result) => {
      if (!result) {
        return res
          .status(401)
          .json({ message: "username or password incorrect" });
      }
      req.user = user;
      return next();
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  username = req.body.username;
  password = req.body.password;

  // check if user already doesn't exist
  userExist = ADMINS.some((user) => {
    return username === user.username;
  });

  if (userExist) {
    return res.status(403).json({ message: "username already taken" });
  } else {
    // hash the password
    bcrypt.hash(password, 10, function (err, hash) {
      // Store hash in memory
      let newUser = {
        id: new Date().getTime(),
        username: username,
        password: hash,
      };
      ADMINS.push(newUser);
    });

    res.json({ message: "Admin createde successfully" });
  }
});

app.post("/admin/login", authenticateAdmin, (req, res) => {
  if (req.user) {
    res.json({ message: "Logged in successfully" });
  }
});

app.post("/admin/courses", authenticateAdmin, (req, res) => {
  // logic to create a course
  let newCourse = { ...req.body, id: new Date().getTime() };
  COURSES.push(newCourse);
  res.json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", authenticateAdmin, (req, res) => {
  // logic to edit a course
  let courseIndex = COURSES.findIndex(
    (course) => course.id == req.params.courseId
  );
  if (!(courseIndex == -1)) {
    COURSES[courseIndex] = { ...COURSES[courseIndex], ...req.body };
    res.json({ message: "Course updated successfully" });
  }
});

app.get("/admin/courses", authenticateAdmin, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const username = req.body.username;
  const password = req.body.password;

  // check if the user already exists
  let userExist = USERS.some((user) => user.username === username);

  if (userExist) {
    return res.status(403).json({ message: "username already taken" });
  }

  // hash the password and push the new user object in USERS
  bcrypt.hash(password, 10, function (err, hash) {
    // Store hash in your memory.
    let newuser = {
      id: new Date().getTime(),
      username: username,
      password: hash,
      purchasedCourses: [],
    };

    USERS.push(newuser);
  });

  res.json({ message: "User created successfully" });
});

app.post("/users/login", authenticateUser, (req, res) => {
  // logic to log in user
  if (req.user) {
    res.json({ message: "Logged in successfully" });
  }
});

app.get("/users/courses", (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", authenticateUser, (req, res) => {
  // logic to purchase a course

  let course = COURSES.find((c) => String(c.id) === req.params.courseId);

  if (course) {
    req.user.purchasedCourses.push(course);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.json({
      message: "Sorry we could not find the course you were looking for",
    });
  }
});

app.get("/users/purchasedCourses", authenticateUser, (req, res) => {
  // logic to view purchased courses
  res.json({ purchasedCourses: req.user.purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
