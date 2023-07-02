const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;
const MDBURI =
  process.env.MDBURI ||
  "mongodb+srv://aditya:aditya@cluster0.tsxb5lv.mongodb.net/course_selling_app";

const ADMIN_AUTH_KEY =
  process.env.ADMIN_KEY || "Scatter senbonzakura senkaimon";
const USER_AUTH_KEY = process.env.USER_KEY || "Roar Zabimaru";

const app = express();
app.use(express.json());

// define mongoose schemas
const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

// define mongoose models
const Admin = mongoose.model("Admin", adminSchema);
const User = mongoose.model("User", userSchema);
const Course = mongoose.model("Course", courseSchema);

// connect database
let isDbCon = false;
mongoose
  .connect(MDBURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "course_selling_app",
  })
  .then(() => {
    isDbCon = true;
    console.log("Connected to mongoDB");
  })
  .catch((err) => {
    console.error("Error connecting mongoDB:", err);
  });

// generate token
const genAdminJwt = (username) => {
  const payload = { username, role: "admin" };
  return jwt.sign(payload, ADMIN_AUTH_KEY, { expiresIn: "1hr" });
};
const genUserJwt = (username) => {
  const payload = { username, role: "user" };
  return jwt.sign(payload, USER_AUTH_KEY, { expiresIn: "1hr" });
};

// middlewares
const dbCon = (req, res, next) => {
  if (isDbCon) {
    return next();
  }
  res.sendStatus(500);
};

// verify token
const adminJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, ADMIN_AUTH_KEY, (err, admin) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.admin = admin;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};
const userJwtAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, USER_AUTH_KEY, (err, user) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = user;
        next();
      }
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", dbCon, async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    try {
      await Admin.create({ username, password });
      const token = genAdminJwt(username);
      res.json({ message: "Admin created successfully", token });
    } catch (err) {
      console.error("Error admin signup:", err);
      res.sendStatus(500);
    }
  }
});

app.post("/admin/login", dbCon, async (req, res) => {
  const { username, password } = req.headers;
  try {
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = genAdminJwt(username);
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(403).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.sendStatus(500);
    console.error("Error admin login:", err);
  }
});

app.post("/admin/courses", dbCon, adminJwtAuth, async (req, res) => {
  const admin = req.admin;
  try {
    const course = new Course(req.body);
    await course.save();
    res.json({ message: "Course created successfully", courseId: course.id });
  } catch (err) {
    console.error("Error creating course:", err);
    res.sendStatus(500);
  }
});

app.put("/admin/courses/:courseId", dbCon, adminJwtAuth, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    if (!mongoose.isValidObjectId(courseId)) {
      return res.status(404).json({ message: "Invalid course id" });
    }
    const course = await Course.findByIdAndUpdate(courseId, req.body, {
      new: true,
    });
    if (course) {
      res.json({ message: "Course updated successfully" });
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (err) {
    res.sendStatus(500);
    console.error("Error updating course:", err);
  }
});

app.get("/admin/courses", dbCon, adminJwtAuth, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json({ courses });
  } catch (err) {
    res.sendStatus(500);
    console.error("Error getting admin courses:", err);
  }
});

// User routes
app.post("/users/signup", dbCon, async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username, password });
    const _id = await User.exists({ username, password });

    if (user) {
      res.status(403).json({ message: "User already exists" });
    } else {
      await User.create({ username, password });
      const token = genUserJwt(username);
      res.json({ message: "User created successfully", token });
    }
  } catch (err) {
    res.sendStatus(500);
    console.error("Error user signup:", err);
  }
});

app.post("/users/login", async (req, res) => {
  const { username, password } = req.headers;
  try {
    const user = User.findOne({ username, password });
    if(user) {
      const token = genUserJwt(username);
      res.json({ message: "Logged in successfully", token });
    } else {
      res.status(403).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    res.sendStatus(500);
    console.err("Error user login:", err);
  }
});

app.get("/users/courses", dbCon, userJwtAuth, async (req, res) => {
  try {
    const courses = await Course.find({ published: true });
    res.json({ courses });
  } catch (err) {
    res.sendStatus(500);
    console.error("Error getting user courses:", err);
  }
});

app.post("/users/courses/:courseId", dbCon, userJwtAuth, async (req, res) => {
  const courseId = req.params.courseId;
  try {
    if(!mongoose.isValidObjectId(courseId)) {
      return res.status(404).json({ message: "Invalid course id" });
    }
    const course = await Course.findById(courseId);
    if(!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const user = await User.findOne({ username: req.user.username });
    if(!user) {
      return res.status(403).json({ message: "User not found" });
    }
    if(user.purchasedCourses.includes(courseId)) {
      return res.status(403).json({ message: "Course already purchased" });
    }
    user.purchasedCourses.push(course);
    await user.save();
    res.json({ message: "Course purchased successfully" });
  } catch (err) {
    res.sendStatus(500);
    console.error("Error purchaing course:", err);
  }
});

app.get("/users/purchasedCourses", dbCon, userJwtAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.user.username });
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }
    const purchasedCourses = await Course.find({ _id: { $in: user.purchasedCourses }});
    res.json({ purchasedCourses });
  } catch (err) {
    res.sendStatus(500);
    console.error("Error getting user purchasedCourses:", err);
  }
});

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});
