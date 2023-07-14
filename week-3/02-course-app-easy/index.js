const express = require("express");

const app = express();
app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//#region helpers
const generateNewId = (list) => {
  let maxId = 0;

  list.forEach((item) => {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });

  return maxId + 1;
};

const findAdmin = ({ username, password }) =>
  ADMINS.find((x) => x.username === username && x.password === password);
const findUser = ({ username, password }) =>
  USERS.find((x) => x.username === username && x.password === password);
const findCourse = ({ title, id }) =>
  COURSES.find((x) => (id && x.id === id) || (title && x.title === title));
//#endregion

//#region middleware
const authenticateAdmin = (req, res, next) => {
  const { username, password } = req.headers;

  const foundAdmin = findAdmin({ username, password });
  if (!foundAdmin) {
    return res.status(404).send({ error: "Admin not Found" });
  }
  req.currentAdmin = foundAdmin;
  next();
};

const authenticateUser = (req, res, next) => {
  const { username, password } = req.headers;

  const foundUser = findUser({ username, password });
  if (!foundUser) {
    return res.status(404).send({ error: "User not Found" });
  }
  req.currentUser = foundUser;
  next();
};
//#endregion

// Admin routes
app.post("/admin/signup", (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .send({ error: "username & password mandatory to signup" });
  }

  const foundAdmin = findAdmin({ username, password });
  if (foundAdmin) {
    return res.status(404).send({ error: "Admin already exists" });
  }

  const newAdmin = { username, password, id: generateNewId(ADMINS) };
  ADMINS.push(newAdmin);

  res.send({ message: "Admin created successfully" });
});

app.post("/admin/login", authenticateAdmin, (req, res) => {
  // logic to log in admin
  res.send({ message: "Logged in successfully" });
});

app.post("/admin/courses", authenticateAdmin, (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  const { title, price } = newCourse;

  if (!title || !price) {
    return res
      .status(404)
      .send({ error: "title & price mandatory to create new course" });
  }

  const foundCourse = findCourse({ title });
  if (foundCourse) {
    return res.status(404).send({ error: "Course already exists" });
  }

  const id = generateNewId(COURSES);

  COURSES.push({ ...newCourse, id });
  res.send({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", authenticateAdmin, (req, res) => {
  // logic to edit a course
  const id = +req.params?.courseId;
  const newCourse = req.body;

  const currentCourse = findCourse({ id });
  if (!currentCourse) {
    return res.status(404).send({ error: "Course not Found" });
  }

  const updatedCourse = { ...currentCourse, ...newCourse, id };

  const courseIndex = COURSES.findIndex((x) => x.id === id);
  COURSES[courseIndex] = updatedCourse;
  res.send({ message: "Course updated successfully" });
});

app.get("/admin/courses", authenticateAdmin, (req, res) => {
  // logic to get all courses
  res.send({ courses: COURSES });
});

// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(404)
      .send({ error: "username & password mandatory to signup" });
  }

  const foundUser = findUser({ username, password });
  if (foundUser) {
    return res.status(404).send({ error: "User already exists" });
  }

  const newUser = { username, password, id: generateNewId(USERS) };
  USERS.push(newUser);

  res.send({ message: "User created successfully" });
});

app.post("/users/login", authenticateUser, (req, res) => {
  // logic to log in user
  res.send({ message: "Logged in successfully" });
});

app.get("/users/courses", authenticateUser, (req, res) => {
  // logic to list all courses
  res.send({ courses: COURSES });
});

app.post("/users/courses/:courseId", authenticateUser, (req, res) => {
  // logic to purchase a course
  const {
    currentUser: { username },
  } = req;
  const id = +req.params?.courseId;
  const foundCourse = findCourse({ id });
  if (!foundCourse) {
    return res.status(404).send({ error: "Course not Found" });
  }
  const userIndex = USERS.findIndex((x) => x.username === username);

  if (USERS[userIndex].purchasedCourseIds?.includes(id)) {
    return res.status(404).send({ error: "Course already purchased" });
  }

  USERS[userIndex].purchasedCourseIds = [
    ...(USERS[userIndex].purchasedCourseIds || []),
    id,
  ];
  res.send({
    message: "Course purchased successfully for: " + username,
  });
});

app.get("/users/purchasedCourses", authenticateUser, (req, res) => {
  // logic to view purchased courses
  const {
    currentUser: { username },
  } = req;

  const { purchasedCourseIds = [] } =
    USERS.find((x) => x.username === username) || {};

  const purchasedCourses = COURSES.filter((course) =>
    purchasedCourseIds.includes(course.id)
  );

  res.send({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
