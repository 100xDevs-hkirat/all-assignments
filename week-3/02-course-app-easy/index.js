const express = require("express");
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post("/admin/signup", (req, res) => {
  const { username, password } = req.body;

  const foundAdminIndex = ADMINS.findIndex(
    (admin) => admin.username === username
  );
  if (foundAdminIndex > -1) return res.sendStatus(409); //for security purpose send 204 or 202

  ADMINS.push({ username, password });

  res.json({ message: "Admin created successfully" });
});

app.post("/admin/login", authenticateAdmin, (req, res) => {
  res.json({ message: "Logged in successfully" });
});

app.post("/admin/courses", authenticateAdmin, (req, res) => {
  const { title, description, price, imageLink, published } = req.body;

  if (!title || !description || !price || !imageLink || !published)
    return res.status(400).json({ message: "Malformed request" });

  const courseId = Date.now();
  COURSES.push({
    id: courseId,
    title,
    description,
    price,
    imageLink,
    published,
  });

  res.json({ message: "Course created successfully", courseId });
});

app.put("/admin/courses/:courseId", authenticateAdmin, (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);

  const foundCourseIndex = COURSES.findIndex(
    (course) => course.id === courseId
  );

  if (foundCourseIndex < 0)
    res.sendStatus(404).json({ message: "Course not found" });
  else {
    COURSES[foundCourseIndex] = { ...COURSES[foundCourseIndex], ...req.body };
    res.json({ message: "Course updated successfully" });
  }
});

app.get("/admin/courses", authenticateAdmin, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  const { username, password } = req.body;

  const foundUserIndex = USERS.findIndex((user) => user.username === username);
  if (foundUserIndex > -1) return res.sendStatus(409); //for security purpose send 204 or 202

  USERS.push({ username, password, purchasedCourses: [] });

  res.json({ message: "User created successfully" });
});

app.post("/users/login", authenticateUser, (req, res) => {
  res.json({ message: "Logged in successfully" });
});

app.get("/users/courses", authenticateUser, (req, res) => {
  const publishedCourses = COURSES.filter((course) => course.published);

  res.json({ courses: publishedCourses });
});

app.post("/users/courses/:courseId", authenticateUser, (req, res) => {
  const courseId = parseInt(req.params.courseId, 10);

  const foundCourseIndex = COURSES.findIndex(
    (course) => course.id === courseId && course.published
  );

  if (foundCourseIndex < 0)
    return res.status(404).json({ message: "Course not found" });

  if (req.user.purchasedCourses.indexOf(courseId) > -1)
    return res.status(409).json({ message: "Course already purchased" }); //would probably show purchased on UI
  req.user.purchasedCourses.push(courseId);
  return res.json({ message: "Course purchased successfully" });
});

app.get("/users/purchasedCourses", authenticateUser, (req, res) => {
  const purchasedCourses = COURSES.filter(
    (course) => req.user.purchasedCourses.indexOf(course.id) > -1
  );

  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});

function authenticateAdmin(req, res, next) {
  const { username, password } = req.headers;

  if (!username || !password) res.sendStatus(401);
  const foundAdmin = ADMINS.find(
    (admin) => admin.username === username && admin.password === password
  );

  if (!foundAdmin)
    res.status(403).json({ error: "Invalid username or password" });
  else next();
}

function authenticateUser(req, res, next) {
  const { username, password } = req.headers;

  if (!username || !password) return res.sendStatus(401);

  const foundUser = USERS.find(
    (user) => user.username === username && user.password === password
  );

  if (!foundUser) res.sendStatus(403);
  else {
    req.user = foundUser;
    next();
  }
}
