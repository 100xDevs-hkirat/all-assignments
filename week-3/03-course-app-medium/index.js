const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_KEY_ADMIN = "superS3cr3ta6m1n";
const SECRET_KEY_USER = "superS3cr3tus3r";
const FILENAME_ADMIN = "admins.json";
const FILENAME_USER = "users.json";
const FILENAME_COURSES = "courses.json";

//#region File helpers
const getListFromFile = (fileName) =>
  new Promise((resolve) => {
    const FILEPATH = path.join(__dirname, "./files/", fileName);
    fs.readFile(FILEPATH, "utf8", (err, data) => {
      if (err) throw err;
      const list =
        typeof data === "string"
          ? JSON.parse(data)
          : typeof data === "object"
            ? data
            : [];
      resolve(list);
    });
  });

const storeListToFile = (fileName, list) =>
  new Promise((resolve) => {
    const FILEPATH = path.join(__dirname, "./files/", fileName);
    fs.writeFile(FILEPATH, JSON.stringify(list), (err) => {
      if (err) throw err;
      resolve(true);
    });
  });

const getAdminsFromFile = () => getListFromFile(FILENAME_ADMIN);
const getUsersFromFile = () => getListFromFile(FILENAME_USER);
const getCoursesFromFile = () => getListFromFile(FILENAME_COURSES);

const storeAdminsToFile = (list) => storeListToFile(FILENAME_ADMIN, list);
const storeUsersToFile = (list) => storeListToFile(FILENAME_USER, list);
const storeCoursesToFile = (list) => storeListToFile(FILENAME_COURSES, list);
//#endregion

//#region helpers
const generateJwt = (payload, secretKey) =>
  jwt.sign(payload, secretKey, { expiresIn: "1h" });
const generateJwtUser = ({ username }) =>
  generateJwt({ username }, SECRET_KEY_USER);
const generateJwtAdmin = ({ username }) =>
  generateJwt({ username }, SECRET_KEY_ADMIN);

const generateNewId = (list) => {
  let maxId = 0;
  list.forEach((item) => {
    if (item.id > maxId) {
      maxId = item.id;
    }
  });
  return String(maxId + 1);
};
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

  const ADMINS = await getAdminsFromFile();
  const foundAdmin = ADMINS.find(
    (x) => x.username === username && x.password === password
  );
  if (foundAdmin) {
    return res.status(403).send({ error: "Admin already exists" });
  }

  const newAdmin = { username, password, id: generateNewId(ADMINS) };
  ADMINS.push(newAdmin);
  await storeAdminsToFile(ADMINS);

  const token = generateJwtAdmin(newAdmin);
  res.json({ message: "Admin created successfully", token });
});

app.post("/admin/login", authenticateAdmin, (req, res) => {
  // logic to log in admin
  const { currentAdmin } = req;
  const token = generateJwtAdmin(currentAdmin);
  res.send({ message: "Logged in successfully", token });
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

  const COURSES = await getCoursesFromFile();
  const foundCourse = COURSES.find((x) => x.title === title);
  if (foundCourse) {
    return res.status(404).send({ error: "Course already exists" });
  }

  const id = generateNewId(COURSES);

  COURSES.push({ ...newCourse, id });
  await storeCoursesToFile(COURSES);

  res.json({ message: "Course created successfully", courseId: id });
});

app.put("/admin/courses/:courseId", authenticateAdmin, async (req, res) => {
  // logic to edit a course
  const { courseId } = req.params;
  const courseToUpdate = req.body;

  const COURSES = await getCoursesFromFile();
  const currentCourse = COURSES.find((x) => x.id === courseId);
  if (!currentCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  const updatedCourse = { ...currentCourse, ...courseToUpdate };

  const courseIndex = COURSES.findIndex((x) => x.id === courseId);
  COURSES[courseIndex] = updatedCourse;
  await storeCoursesToFile(COURSES);

  res.json({ message: "Course updated successfully" });
});

app.get("/admin/courses", authenticateAdmin, async (req, res) => {
  // logic to get all courses
  const courses = await getCoursesFromFile();
  res.send({ courses });
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

  const USERS = await getUsersFromFile();
  const foundUser = USERS.find(
    (x) => x.username === username && x.password === password
  );
  if (foundUser) {
    return res.status(403).json({ message: "User already exists" });
  }

  const newUser = { username, password, id: generateNewId(USERS) };
  USERS.push(newUser);
  await storeUsersToFile(USERS);

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
  const allCourses = await getCoursesFromFile();
  const courses = allCourses.filter(x => x.published === true);
  res.json({ courses });
});

app.post("/users/courses/:courseId", authenticateUser, async (req, res) => {
  // logic to purchase a course
  const {
    currentUser: { username },
  } = req;
  const { courseId } = req.params;

  const COURSES = await getCoursesFromFile();
  const foundCourse = COURSES.find((x) => x.id === courseId);
  if (!foundCourse) {
    return res.status(404).json({ message: "Course not found" });
  }

  const USERS = await getUsersFromFile();
  const userIndex = USERS.findIndex((x) => x.username === username);
  if (USERS[userIndex].purchasedCourses?.includes(courseId)) {
    return res.status(404).send({ error: "Course already purchased" });
  }

  USERS[userIndex].purchasedCourses = [
    ...(USERS[userIndex].purchasedCourses || []),
    courseId,
  ];

  await storeUsersToFile(USERS);

  res.json({
    message: "Course purchased successfully for: " + username,
  });
});

app.get("/users/purchasedCourses", authenticateUser, async (req, res) => {
  // logic to view purchased courses
  const {
    currentUser: { username },
  } = req;

  const USERS = await getUsersFromFile();
  const currentUser = USERS.find((x) => x.username === username);
  
  const COURSES = await getCoursesFromFile();
  const purchasedCourses = COURSES.filter((course) =>
    currentUser.purchasedCourses.includes(course.id)
  );

  res.json({ purchasedCourses });
});

app.listen(3000, () => console.log("Server running on port 3000"));
