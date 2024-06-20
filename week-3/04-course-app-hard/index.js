const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// mongodb+srv://bugtesting000:bugbugbug@cluster0.xsolrrd.mongodb.net/?retryWrites=true&w=majority
// mongodb+srv://bugtesting000:<password>@cluster0.xsolrrd.mongodb.net/

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// secret key for JWT
const jwtSecret = "dosomecoolshit";

// establishing a connection to mongodb instance and starting the server
const uri =
  "mongodb+srv://bugtesting000:bugbugbug@cluster0.xsolrrd.mongodb.net/test";

mongoose
  .connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("Connected to mongoDB instance.");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    return res.status(500).json({ messag: err.message });
  });

// defining schema for user, admin , courses
const userSchema = new mongoose.Schema({
  isAdmin: Boolean,
  username: String,
  password: String,
  purchasedCourses: Array,
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const Admin = mongoose.model("Admin", userSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

// initializing the arrays with fetched data
app.use(async (req, res, next) => {
  try {
    ADMINS = await Admin.find({});
    USERS = await User.find({});
    COURSES = await Course.find({});

    next();
  } catch (err) {
    console.log(err.message);
  }
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
app.post("/admin/signup", async (req, res) => {
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
  bcrypt.hash(password, 10, async function (err, hash) {
    // Store hash in memory

    // create and push new user
    let newUser = {
      id: new Date().getTime(),
      isAdmin: true,
      username: username,
      password: hash,
    };

    let newUserdb = new Admin(newUser);
    await newUserdb.save();

    // now generate a jwt
    const token = jwt.sign(
      {
        userId: newUser.id,
        isAdmin: newUser.isAdmin,
      },
      jwtSecret,
      { expiresIn: 60 * 60 }
    );

    // send the token in response to the user
    res.json({ message: "Admin createde successfully", token: token });
  });
});

app.post("/admin/login", authenticateAdmin, (req, res) => {
  // logic to log in admin
  if (req.user) {
    // create a jwt
    let token = jwt.sign({ userId: req.user.id }, jwtSecret, {
      expiresIn: 60 * 60,
    });

    res.json({ message: "Logged in successfully", token: token });
  }
});

app.post("/admin/courses", verifyToken, async (req, res) => {
  // logic to create a course
  let newCoursedb = new Course(req.body);
  await newCoursedb.save();
  res.json({
    message: "Course created successfully",
    courseId: newCoursedb.id,
  });
});

app.put("/admin/courses/:courseId", verifyToken, async (req, res) => {
  // logic to edit a course
  // let course = COURSES.find((course) => course.id == req.params.courseId);
  // if (course) {
  // COURSES[courseIndex] = { ...COURSES[courseIndex], ...req.body };
  // let newCourse = { ...course, ...newCourse };
  await Course.findByIdAndUpdate(req.params.courseId, req.body);
  // Course.findOneAndUpdate({ courseId: course.courseId }, req.body);
  res.json({ message: "Course updated successfully" });
  // }
});

app.get("/admin/courses", verifyToken, (req, res) => {
  // logic to get all courses
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", async (req, res) => {
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
  bcrypt.hash(password, 10, async function (err, hash) {
    // Store hash in memory

    let newUser = new User({
      isAdmin: false,
      username: username,
      password: hash,
      purchasedCourses: [],
    });

    await newUser.save();
    // now generate a jwt
    const token = jwt.sign(
      {
        userId: newUser.id,
        isAdmin: newUser.isAdmin,
      },
      jwtSecret,
      { expiresIn: 60 * 60 }
    );

    // send the token in response to the user
    res.json({ message: "User createde successfully", token: token });
  });
});

app.post("/users/login", authenticteUser, (req, res) => {
  // logic to log in user
  if (req.user) {
    // create a jwt
    let token = jwt.sign({ userId: req.user.id }, jwtSecret, {
      expiresIn: 60 * 60,
    });

    res.json({ message: "Logged in successfully", token: token });
  }
});

app.get("/users/courses", verifyToken, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES });
});

app.post("/users/courses/:courseId", verifyToken, async (req, res) => {
  // logic to purchase a course
  let course = await Course.findById(req.params.courseId);
  req.user.purchasedCourses.push(course);
  await User.findByIdAndUpdate(req.user.id, req.user);
  res.json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", verifyToken, (req, res) => {
  // logic to view purchased courses
  res.json({ purchasedCourses: req.user.purchasedCourses });
});
