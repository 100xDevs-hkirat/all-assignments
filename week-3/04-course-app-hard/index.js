const express = require("express");
const { default: mongoose } = require("mongoose");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const SECREATKEY = "authkey";

//mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String }, // only string has same purpose
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // An array of ObjectIds referencing the 'Course' model
});
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const User = mongoose.model("User", userSchema);
const Admin = mongoose.model("Admin", adminSchema);
const Course = mongoose.model("Course", courseSchema);

//to connect mongoDB
mongoose.connect(
  "mongodb+srv://amanrawat9690:1OrKGoXfozOszSHz@cluster0.grdmre6.mongodb.net/courses",
  { useNewUrlParser: true, useUnifiedTopology: true } //dbName: "courses"
);

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECREATKEY, (err, decryptData) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = decryptData;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username }); // just like .find() method of array
  if (admin) {
    res.status().json({ message: "Admin already exists" });
  } else {
    const newAdminObj = { username, password };
    const newAdmin = new Admin(newAdminObj); //creating instance of newAdmin
    await newAdmin.save(); //saving newAdmin to DB
    const token = jwt.sign({ username, role: "admin" }, SECREATKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

app.post("/admin/login", async (req, res) => {
  const { username, passsword } = req.headers;
  const admin = await Admin.findOne({ username, passsword });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECREATKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  // const course = req.body;    //course obj
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  }); // will return the updated course or err //The { new: true } option is used to ensure that the updated course is returned in the updatedCourse variable
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  const courses = await Course.find({}); //It allows you to find multiple documents that satisfy the specified conditions.
  //empty obj {} means => retrieve all documents in the specified collection ie Courses
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECREATKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECREATKEY, {
      expiresIn: "1h",
    });
    res.json({ message: "Logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: "Course purchased successfully" });
    } else {
      res.status(403).json({ message: "User not found" });
    }
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/users/purchasedCourses", authenticateJwt, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username }).populate(
    "purchasedCourses"
  );
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: "User not found" });
  }
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000 , xyz");
});
