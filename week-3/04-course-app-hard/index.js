const express = require('express');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());


const ADMINSECRET = "admins3cr3t";
const USERSECRET = "users3cr3t";

//defining mongo schemas
const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }]
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

//Defining mongoose model
const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model('Course', courseSchema);

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect('', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "course_selling_application" });

function adminGenerateJwt(user) {
  let admin = { username: user.username };
  return jwt.sign(admin, ADMINSECRET, { expiresIn: "1h" });
}

function userGenerateJwt(user) {
  let admin = { username: user.username };
  return jwt.sign(admin, USERSECRET, { expiresIn: "1h" });
}

const ADMINAUTHENTICATIONJWT = (req, res, next) => {
  let jwtToken = req.headers.authorization;
  let token = jwtToken.split(" ");
  if (token) {
    jwt.verify(token[1], ADMINSECRET, (err, original) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = original;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const USERAUTHENTICATIONJWT = (req, res, next) => {
  let jwtToken = req.headers.authorization;
  let token = jwtToken.split(" ");
  if (token) {
    jwt.verify(token[1], USERSECRET, (err, original) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = original;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  let { username, password } = req.body;
  let admin = await Admin.findOne({ username, password });
  if (admin) {
    res.status(403).json({ message: "Admin already exits" });
  } else {
    let obj = { username: username, password: password };
    let jwtToken = adminGenerateJwt(obj);
    const newAdmin = new Admin(obj);
    newAdmin.save();
    res.status(200).json({ message: "Admin created Successfully", token: jwtToken });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  let { username, password } = req.headers;
  let admin = await Admin.findOne({ username, password });
  if (admin) {
    let obj = { username: username, password: password };
    let jwtToken = adminGenerateJwt(obj);
    res.status(200).json({ message: "Login successfull", token: jwtToken });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.post('/admin/courses', ADMINAUTHENTICATIONJWT, (req, res) => {
  // logic to create a course
  let course = req.body;
  const newCourse = new Course(course);
  newCourse.save();
  res.status(200).json({ message: "Course created", id: newCourse.id });
});

app.put('/admin/courses/:courseId', ADMINAUTHENTICATIONJWT, async (req, res) => {
  let checkObj = mongoose.isValidObjectId(req.params.courseId);
  if (checkObj) {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } else {
    res.status(404).json({ message: "Invalid course Id" });
  }
});

app.get('/admin/courses', ADMINAUTHENTICATIONJWT, async (req, res) => {
  // logic to get all courses
  let courses = await Course.find();
  res.status(200).json({ courses: courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  let { username, password } = req.body;
  let user = await User.findOne({ username, password });
  if (user) {
    res.status(403).json({ message: "User already exits" });
  } else {
    let obj = { username: username, password: password };
    let jwtToken = userGenerateJwt(obj);
    const newUser = new User(obj);
    newUser.save();
    res.status(200).json({ message: "User created Successfully", token: jwtToken });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  let { username, password } = req.headers;
  let user = await User.findOne({ username, password });
  if (user) {
    let obj = { username: username, password: password };
    let jwtToken = userGenerateJwt(obj);
    res.status(200).json({ message: "Login successfull", token: jwtToken });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.get('/users/courses', USERAUTHENTICATIONJWT, async (req, res) => {
  // logic to list all courses
  let courses = await Course.find({ published: true });
  res.status(200).json({ courses: courses });
});

app.post('/users/courses/:courseId', USERAUTHENTICATIONJWT, async (req, res) => {
  // logic to purchase a course
  let course = await Course.findById(req.params.courseId);
  // console.log(course);
  if (course) {
    let user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course Purchases", course: course });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get('/users/purchasedCourses', USERAUTHENTICATIONJWT, async (req, res) => {
  // logic to view purchased courses
  let user = await User.findOne({ username: req.user.username }).populate("purchasedCourses");
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(403).json({ message: "user not found" });
  }
});

app.use((req, res, next) => {
  res.status(404).send("No such route found...");
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
