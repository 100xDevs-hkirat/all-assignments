const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());

const SECRET_KEY = "LyahKpu4AE0=";
const DB_CONNECTION_STRING =
  "mongodb+srv://kevin:Nn8qxI11qdp5zTFM@cluster0.earccqg.mongodb.net/?retryWrites=true&w=majority";

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageLink: { type: String, required: true },
  published: { type: Boolean, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

mongoose.connect(DB_CONNECTION_STRING);

// Admin routes
app.post("/admin/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });

    if (admin) return res.sendStatus(409);

    const newAdmin = new Admin({ username, password });
    await newAdmin.save();

    const token = generateToken({ username });

    res.json({ message: "Admin created successfully", token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/admin/login", async (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) return res.sendStatus(401);
  try {
    const admin = await Admin.findOne({ username, password });
    if (!admin)
      return res.status(403).json({ error: "Invalid username or password" });

    const token = generateToken({ username });

    res.json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  const { title, description, price, imageLink, published } = req.body;

  if (!title || !description || !price || !imageLink || !published)
    return res.status(400).json({ message: "Malformed request" });

  try {
    const newCourse = new Course({
      title,
      description,
      price,
      imageLink,
      published,
    });
    await newCourse.save();

    res.json({
      message: "Course created successfully",
      courseId: newCourse.id,
    });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated successfully" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  try {
    const courses = await Course.find({});

    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// User routes
app.post("/users/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user) return res.sendStatus(409);

    const newUser = new User({ username, password });
    await newUser.save();

    const token = generateToken({ username });

    res.json({ message: "User created successfully", token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;

  if (!username || !password) return res.sendStatus(401);
  try {
    const user = await User.findOne({ username, password });
    if (!user)
      return res.status(403).json({ error: "Invalid username or password" });

    const token = generateToken({ username });
    res.json({ message: "Logged in successfully", token });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/users/courses", authenticateJwt, async (req, res) => {
  try {
    const courses = await Course.find({ published: true });

    res.json({ courses });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.post("/users/courses/:courseId", authenticateJwt, async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findOne({ username: req.user.username });
    if (!user) return res.sendStatus(403);

    if (user.purchasedCourses.includes(courseId))
      return res.status(409).json({ message: "Course already purchased" }); //would probably show purchased on UI

    user.purchasedCourses.push(courseId);
    await user.save();
    res.json({ message: "Course purchased successfully" });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

app.get("/users/purchasedCourses", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username }).populate(
      "purchasedCourses"
    );
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.sendStatus(403);
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

function generateToken({ username }) {
  const payload = { username };
  return jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
}

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.sendStatus(401);

  const token = authHeader.split(" ")[1];

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);

    req.user = user;
    next();
  });
}

app.use((err, req, res, next) => {
  res.status(500).json({ error: "Something went wrong" });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
