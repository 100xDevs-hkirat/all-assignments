const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ADMINS = require("./models/ADMINS");
const USERS = require("./models/USERS");
const COURSES = require("./models/COURSES");

// Load environment variables from a .env file
dotenv.config();

const app = express();

app.use(express.json());
const secretKey = "anySecretKey";

const generateJwt = (username) => {
  return jwt.sign({ user: username }, secretKey, { expiresIn: "1h" });
};

const authJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, secretKey, (err, data) => {
      if (err) {
        return res.status(401).json({ message: "Authorization Falied" });
      }

      req.user = data.user;
      next();
    });
  } else {
    res.status(403).json({ message: "Authorization Header not found" });
  }
};

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  const usernameFound = await ADMINS.findOne({ username });

  if (usernameFound) {
    res.status(403).json({ message: "Username already exist" });
  } else {
    const token = generateJwt(username);
    const newAdmin = new ADMINS({ username, password });
    await newAdmin.save();
    res.status(201).json({ message: "Admin created Successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;

  const adminFound = await ADMINS.findOne({ username, password });

  if (adminFound) {
    const token = generateJwt(username);
    res.status(200).json({ message: "Logged in Successfully", token });
  } else {
    res.status(404).json({ message: "username or password is incorrect" });
  }
});

app.post("/admin/courses", authJwt, async (req, res) => {
  // logic to create a course
  const courseDetails = req.body;

  if (!courseDetails) {
    return res.status(404).json({ message: "Course Details are not present" });
  }

  const courseExists = await COURSES.find({ ...courseDetails });

  if (courseExists) {
    return res
      .status(409)
      .json({ error: "Error occurred , Course Already Exists" });
  }

  const course = new COURSES({ ...courseDetails });
  await course.save();
  res.status(201).json({
    message: "Course Created Successfully",
    courseId: course._id,
  });
});

app.put("/admin/courses/:courseId", authJwt, async (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const courseFound = await COURSES.findOne({ _id: courseId });
  if (courseFound) {
    Object.assign(courseFound, req.body);
    await courseFound.save();
    res.status(200).json({ message: "Course Updated Successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authJwt, async (req, res) => {
  // logic to get all courses
  const allCourses = await COURSES.find();

  res.status(200).json({ courses: allCourses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  const userExist = await USERS.findOne({ username });

  if (userExist) {
    res.status(406).json({ message: "Username already exists" });
  } else {
    const newUser = new USERS({ username, password });
    await newUser.save();
    const token = generateJwt(username);
    res.status(201).json({ message: "user created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;

  const userFound = await USERS.findOne({ username });

  if (userFound) {
    const token = generateJwt(username);
    res.status(202).json({ message: "Logged in Successfully", token });
  } else {
    res.status(404).json({ message: "user not found" });
  }
});

app.get("/users/courses", authJwt, async (req, res) => {
  // logic to list all courses
  const allCourses = await COURSES.find();
  res.status(200).json({ courses: allCourses });
});

app.post("/users/courses/:courseId", authJwt, async (req, res) => {
  // logic to purchase a course
  const courseId = new mongoose.Types.ObjectId(req.params.courseId);
  const courseFound = await COURSES.findOne({ _id: courseId });

  if (courseFound) {
    const user = await USERS.findOne({ username: req.user });

    const alreadyPurchased = user.purchasedCourses.find((_id) =>
      _id.equals(courseId)
    );

    if (alreadyPurchased) {
      return res.status(400).json({ error: "already Purchased the course" });
    }

    user.purchasedCourses.push({ _id: courseId });
    await user.save();
    res.status(200).json({
      message: "course Purchased Successfully",
    });
  } else {
    res.status(404).json({
      message: "Course not found",
    });
  }
});

app.get("/users/purchasedCourses", authJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await USERS.findOne({ username: req.user });

  console.log(user.purchasedCourses);

  const courses = await Promise.all(
    user.purchasedCourses.map(async (_id) => await COURSES.findOne({ _id }))
  );

  res.status(200).json({
    purchasedCourses: courses,
  });
});

// connecting mongoose to our database
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(3000, () =>
      console.log(`Database Connected & Server Port: 3000`)
    );
  })
  .catch((err) => console.log(`${err.message} didn't connect`));
