const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();

app.use(express.json());

const SECRET = "your-secret";

// define mongoose schemas                      /// shape of the data
const userSchema = new mongoose.Schema({
  username: String, // or { type: String }
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  // so purchasedCourses is an array of ObjectIds that refer to Course documents
  // types.ObjectId is basically telling the type of data similar to username: String, password: String and aslo ref: "Course" is telling that the ObjectId is referring to Course document or Course Schema it wont be random id it will be something present in Course Schema.
  //so it will only let you add the id of the course that is present in the Course Schema
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

// define mongoose models    // model to store the data

const User = mongoose.model("User", userSchema); // basically there will be a folder named or collection schema name User which will contain all the info of the userSchema
const Admin = mongoose.model("Admin", adminSchema); // same as above for adminSchema
const Course = mongoose.model("Course", courseSchema); // same as above for courseSchema

//connect to MongoDB

mongoose.connect(
  "mongodb+srv://asdasdjhasdjhjs@cluster0.ixegykn.mongodb.net/courses",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

// authenticate Jwt middleware

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// Admin routes
app.post("/admin/signup", async (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  // findOne is a mongoose method which will find the first document that matches the query criteria here it will find the first document that matches the username in the Admin model which has the adminSchema
  // await does not stop the thread it gives the control to the event loop and when the promise is resolved it will continue the execution of the code till then it will execute the other code or other http requests
  if (admin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    const newAdmin = new Admin({ username, password }); //here when key and value of an object are same we can use this syntax instead of {username: username, password: password} also her Admin is the model with adminSchema and new to create a new document in the Admin model with adminSchema
    await newAdmin.save(); // save will put the newAdmin object in the Admin model with adminSchema
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin created successfully", token });
  }
});

//or above can be written using then
// app.post("/admin/signup", (req, res) => {
//   const { username, password } = req.body;
//   Admin.findOne({ username }).then((admin) => {
//     if (admin) {
//       res.status(403).json({ message: "Admin already exists" });
//     } else {
//       const newAdmin = new Admin({ username, password });
//       newAdmin.save();
//       const token = jwt.sign({username, role:'admin'}, SECRET, {expiresIn: '1h'});
//       res.json({message: 'Admin created successfully', token});
//     }
//   });
// });

app.post("/admin/login", async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (admin) {
    const token = jwt.sign({ username, role: "admin" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Admin logged in successfully", token });
  } else {
    res.status(403).json({ message: "Invalid username or password" });
  }
});

app.post("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to create a course
  const course = new Course(req.body); // create a new course object with the data from the request body in the Course model with courseSchema
  await course.save(); // save the course object in the Course model with courseSchema
  res.json({ message: "Course created successfully", courseId: course.id });
});

app.put("/admin/courses/:courseId", authenticateJwt, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {
    new: true,
  });
  if (course) {
    res.json({ message: "Course updated successfully" });
  } else {
    res.status(404).json({ message: "Course not found" });
  }
});

app.get("/admin/courses", authenticateJwt, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({}); // empty object will return all the documents in the Course model with courseSchema we can also pass a query object to find method to find the documents that match the query object
  res.json({ courses });
});

// User routes
app.post("/users/signup", async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user) {
    res.status(403).json({ message: "User already exists" });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "User created successfully", token });
  }
});

app.post("/users/login", async (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username, role: "user" }, SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "User logged in successfully", token });
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
  // logic to purchase a course
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
    res.status(403).json({ message: "Course not found" });
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
  console.log("Server is listening on port 3000");
});
