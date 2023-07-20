const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY_ADMIN = "superS3cr3ta6m1n";
const SECRET_KEY_USER = "superS3cr3tus3r";

//#region Database helpers
// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
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

// Define mongoose models
const UserModel = mongoose.model("User", userSchema);
const AdminModel = mongoose.model("Admin", adminSchema);
const CourseModel = mongoose.model("Course", courseSchema);

// Connect to MongoDB
const connectionString =
  "mongodb+srv://anants888:o2CO0m2UxCqf5d6L@cluster0.7otij2p.mongodb.net";
const dBName = "courses";
mongoose.connect(`${connectionString}/${dBName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//#endregion

//#region helpers
const generateJwt = (payload, secretKey) =>
  jwt.sign(payload, secretKey, { expiresIn: "1h" });
const generateJwtUser = ({ username }) =>
  generateJwt({ username }, SECRET_KEY_USER);
const generateJwtAdmin = ({ username }) =>
  generateJwt({ username }, SECRET_KEY_ADMIN);
//#endregion

//#region middleware
const authenticateJwt = (secretKey, req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, data) => {
    if (err) {
      return res.sendStatus(403);
    }

    const reqKey =
      secretKey === SECRET_KEY_ADMIN ? "currentAdmin" : "currentUser";
    req[reqKey] = data;
    next();
  });
};
const authenticateUser = (...args) => authenticateJwt(SECRET_KEY_USER, ...args);
const authenticateAdmin = (...args) =>
  authenticateJwt(SECRET_KEY_ADMIN, ...args);
//#endregion

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .send({ error: "username & password mandatory to signup" });
  }

  const foundAdmin = await AdminModel.findOne({ username });
  if (foundAdmin) {
    return res.status(403).send({ error: "Admin already exists" });
  }

  const newAdmin = { username, password };
  const adminModel = new AdminModel(newAdmin);
  await adminModel.save();

  const token = generateJwtAdmin(newAdmin);
  res.json({ message: "Admin created successfully", token });
});

// app.post("/admin/login", authenticateAdmin, (req, res) => {
//   // logic to log in admin
//   const { currentAdmin } = req;
//   const token = generateJwtAdmin(currentAdmin);
//   res.send({ message: "Logged in successfully", token });
// });

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .send({ error: "username & password mandatory to signup" });
  }

  const foundAdmin = await AdminModel.findOne({ username });
  if (!foundAdmin) {
    return res.status(403).send({ error: "Admin not found" });
  }

  const token = generateJwtAdmin(foundAdmin);
  res.json({ message: "Admin logged-in successfully", token });
});

app.post("/admin/courses", authenticateAdmin, async (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  const { title, price } = newCourse;

  if (!title || !price) {
    return res
      .status(404)
      .send({ error: "title & price mandatory to create new course" });
  }

  const foundCourse = await CourseModel.findOne({ title });
  if (foundCourse) {
    return res.status(404).send({ error: "Course already exists" });
  }

  const courseModel = new CourseModel(newCourse);
  await courseModel.save();
  const id = courseModel.id;

  res.json({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", authenticateAdmin, async (req, res) => {
  // logic to edit a course
  const { courseId } = req.params;
  const courseToUpdate = req.body;
  const updatedCourse = await CourseModel.findByIdAndUpdate(
    courseId,
    courseToUpdate,
    { new: true }
  );
  if (!updatedCourse) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json({ message: "Course updated successfully" });
});

app.get("/admin/courses", authenticateAdmin, async (req, res) => {
  // logic to get all courses
  const courses = await CourseModel.find({});
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .send({ error: "username & password mandatory to signup" });
  }

  const foundUser = await UserModel.findOne({ username });
  if (foundUser) {
    return res.status(403).json({ message: "User already exists" });
  }

  const newUser = { username, password };
  const userModel = new UserModel({ username, password });
  await userModel.save();
  const token = generateJwtUser(newUser);
  res.json({ message: "User created successfully", token });
});

app.post("/users/login", authenticateUser, (req, res) => {
  // logic to log in user
  const { currentUser } = req;
  const token = generateJwtUser(currentUser);
  res.send({ message: "Logged in successfully", token });
});

app.get("/users/courses", authenticateUser, async (req, res) => {
  // logic to list all courses
  const courses = await CourseModel.find({ published: true });
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateUser, async (req, res) => {
  // logic to purchase a course
  const {
    currentUser: { username },
  } = req;
  const { courseId } = req.params;

  const foundCourse = await CourseModel.findById(courseId);
  if (!foundCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  const currentUser = await UserModel.findOne({ username });
  currentUser.purchasedCourses.push(foundCourse);
  await currentUser.save();
  res.json({
    message: "Course purchased successfully for: " + username,
  });
});

app.get("/users/purchasedCourses", authenticateUser, async (req, res) => {
  // logic to view purchased courses
  const {
    currentUser: { username },
  } = req;

  const currentUser = await UserModel.findOne({ username }).populate(
    "purchasedCourses"
  );
  const purchasedCourses = currentUser.purchasedCourses || [];
  res.json({ purchasedCourses });
});

app.listen(3000, () => console.log("Server running on port 3000"));
