const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const fs = require("fs-extra");
const path = require("path");

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// secret key for JWT
const jwtSecret = "dosomecoolshit";

// middleware for getting data out of files and initializing the arrays
app.use((req, res, next) => {
  ADMINS = fs.readJSONSync(
    path.resolve(__dirname, "files", "admins.json"),
    "utf-8"
  );

  USERS = fs.readJSONSync(
    path.resolve(__dirname, "files", "users.json"),
    "utf-8"
  );

  COURSES = fs.readJSONSync(
    path.resolve(__dirname, "files", "courses.json"),
    "utf-8"
  );

  next();
});

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

// middleware to authenticate user
const authenticteUser = (req, res, next) => {
  let username = req.headers.username;
  let password = req.headers.password;
  // get the username
  let user = USERS.find((u) => u.username == username);

  //if user is not found return eror
  if (!user) {
    return res.status(401).json({ message: "username or password incorrect." });
  }

  // compare the hash
  bcrypt.compare(password, user.password).then((result) => {
    if (result) {
      req.user = user;
      next();
    } else {
      return res.json({ message: "invalid username or password" });
    }
  });
};

// middleware for token verification
const verifyToken = (req, res, next) => {
  let token = String(req.headers.authorization).replace("Bearer ", "");

  jwt.verify(token, jwtSecret, function (err, decoded) {
    if (err) {
      console.log("JWT verificatio Error : ", err.message);
      return res.json({ "Invalid JWT Token : ": err.message });
    }

    // find the user
    let Lookup = decoded.isAdmin ? ADMINS : USERS;
    let user = Lookup.find((u) => {
      return u.id == decoded.userId;
    });

    // attach the user object with req
    req.user = user;
    next();
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
  }
  // hash the password
  bcrypt.hash(password, 10, function (err, hash) {
    // Store hash in memory

    // create and push new user
    let newUser = {
      id: new Date().getTime(),
      isAdmin: true,
      username: username,
      password: hash,
    };
    ADMINS.push(newUser);
    fs.writeJSONSync(path.resolve(__dirname, "files", "admins.json"), ADMINS);

    // now generate a jwt
    const token = jwt.sign(
      {
        userId: newUser.id,
        isAdmin: newUser.isAdmin,
      },
      jwtSecret,
      { expiresIn: 25 }
    );

    // send the token in response to the user
    res.json({ message: "Admin createde successfully", token: token });
  });
});

app.post("/admin/login", authenticateAdmin, (req, res) => {
  // logic to log in admin
  if (req.user) {
    // create a jwt
    let token = jwt.sign({ userId: req.user.id }, jwtSecret, { expiresIn: 25 });

    res.json({ message: "Logged in successfully", token: token });
  }
});

app.post("/admin/courses", verifyToken, (req, res) => {
  // logic to create a course
  let newCourse = { ...req.body, id: new Date().getTime() };
  COURSES.push(newCourse);
  fs.writeJSONSync(path.resolve(__dirname, "files", "courses.json"), COURSES);
  res.json({ message: "Course created successfully", courseId: newCourse.id });
});

app.put("/admin/courses/:courseId", verifyToken, (req, res) => {
  // logic to edit a course
  let courseIndex = COURSES.findIndex(
    (course) => course.id == req.params.courseId
  );
  if (!(courseIndex == -1)) {
    COURSES[courseIndex] = { ...COURSES[courseIndex], ...req.body };
    fs.writeJSONSync(path.resolve(__dirname, "files", "courses.json"), COURSES);
    res.json({ message: "Course updated successfully" });
  }
});

app.get("/admin/courses", verifyToken, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  username = req.body.username;
  password = req.body.password;

  // check if user already doesn't exist
  userExist = USERS.some((user) => {
    return username === user.username;
  });

  if (userExist) {
    return res.status(403).json({ message: "username already taken" });
  }
  // hash the password
  bcrypt.hash(password, 10, function (err, hash) {
    // Store hash in memory

    // create and push new user
    let newUser = {
      id: new Date().getTime(),
      isAdmin: false,
      username: username,
      password: hash,
      purchasedCourses: [],
    };

    USERS.push(newUser);
    fs.writeJSONSync(path.resolve(__dirname, "files", "users.json"), USERS);
    // now generate a jwt
    const token = jwt.sign(
      {
        userId: newUser.id,
        isAdmin: newUser.isAdmin,
      },
      jwtSecret,
      { expiresIn: 40 }
    );

    // send the token in response to the user
    res.json({ message: "User createde successfully", token: token });
  });
});

app.post("/users/login", authenticteUser, (req, res) => {
  // logic to log in user
  if (req.user) {
    // create a jwt
    let token = jwt.sign({ userId: req.user.id }, jwtSecret, { expiresIn: 40 });

    res.json({ message: "Logged in successfully", token: token });
  }
});

app.get("/users/courses", verifyToken, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", verifyToken, (req, res) => {
  // logic to purchase a course
  let course = COURSES.find((c) => String(c.id) === req.params.courseId);

  if (course) {
    req.user.purchasedCourses.push(course);
    fs.writeJSONSync(path.resolve(__dirname, "files", "users.json"), USERS);
    res.json({ message: "Course purchased successfully" });
  } else {
    res.json({
      message: "Sorry we could not find the course you were looking for",
    });
  }
});

app.get("/users/purchasedCourses", verifyToken, (req, res) => {
  // logic to view purchased courses
  res.json({ purchasedCourses: req.user.purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
