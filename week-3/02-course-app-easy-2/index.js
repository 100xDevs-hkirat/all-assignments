const express = require("express");
const app = express();

app.use(express.json());

const AdminsecretKey = AdminS3cr38;
const userSecretKey = us3rS3cr38;

function AdminJwToken(user) {
  const expiresIn = "1h";
  const payload = user.username;
  const token = jwt.sign(payload, AdminsecretKey, { expiresIn });
  return token;
}

function userJwtToken(user) {
  const expiresIn = "1h";
  const payload = user.username;
  const token = jwt.sign(payload, userSecretKey, { expiresIn });
  return token;
}

function adminAuthentication(token) {
  const jwtToken = req.headers.authorization;

  if (jwtToken) {
    const token = jwtToken.split(" ")[1];
    jwt.verify(token, AdminsecretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(403);
  }
}

function userAuthentication(token) {
  const jwtToken = req.headers.authorization;
  if (jwtToken) {
    const token = jwtToken.split(" ")[1];
    jwt.verify(token, userSecretKey, (err, user) => {
      if (err) {
        res.sendStatus(403);
      }
      res.user = user;
      next();
    });
  } else {
    res.sendStatus(403);
  }
}

// Admin routes

// logic to sign up admin

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes

// logic to sign up admin
app.post("/admin/signup", (req, res) => {
  const admin = req.body;

  if (admin.username && admin.password) {
    const existingUser = ADMINS.find((a) => a.username === admin.username);
    if (existingUser) {
      res.status(403).send("user already exists");
    }

    ADMINS.push(admin);
    const token = AdminJwToken(admin);
    res.status(201).send({ message: "Admin created sucessfully", token });
  } else {
    res.status(404).send("error");
  }
});

// logic to log in admin
app.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  const admin = ADMINS.find(
    (a) => a.username === username && a.password === password
  );

  if (admin) {
    const token = AdminJwToken(admin);
    res.status(201).json({ message: "logged in successfully", token });
  } else {
    res.status(403).json({ message: "admin authentication failed"});
  }
});

// logic to create a course
app.post("/admin/courses", adminAuthentication, (req, res) => {
  const course = req.body;

  course.id = Date.now();
  COURSES.push(course);
  res
    .status(201)
    .json({ message: "course created successfully", courseId: course.id });
});

// logic to edit a course
app.put("/admin/courses/:courseId", adminAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  if (courseId) {
    const course = COURSES.find((course) => course.id === courseId);
    Object.assign(course, req.body);
    res.status(201).json({ message: "course updated successfully" });
  } else {
    res.status(400).json({ message: "course not found" });
  }
});

// logic to get all courses
app.get("/admin/courses", userAuthentication, (req, res) => {
  const filterdCourses = [];
  COURSES.map((c) => {
    if (c.published) {
      filterdCourses.push(c);
    }
  });
  if (filterdCourses.length > 0) {
    res.status(200).json(filterdCourses);
  } else {
    res.status(401).send({ message: "no publised courses found" });
  }
});

// User routes

// logic to sign up user
app.post("/users/signup",  (req, res) => {
  const user = req.body;

  if (user.username && user.password) {
    const newUser = {
      username: user.username,
      password: user.password,
      purchased: [],
    };
    USERS.push(newUser);
    const token = userJwtToken(user)
    res.status(201).send({message:'user created successfully',token});
  } else {
    res.status(400).send("please enter username and passoword");
  }
});

// logic to log in user
app.post("/users/login",  (req, res) => {
  const {username, password} = req.headers;
 const user = USERS.find(u=> u.username === username && u.password === password);

 if(user){
  const token = userJwtToken(user);
  res.status(202).json({message:'user logged in successfully', token})
 }else{

   res.status(403).json({ message: "user authentication failed" });
 }
});

// logic to list all courses
app.get("/users/courses", userAuthentication, (req, res) => {
  const courses = COURSES.filter((course) => course.published);
  if (courses.length) {
    res.status(200).json(courses);
  } else {
    res.status(403).json({ message: "no courses found" });
  }
});

// logic to purchase a course
app.post("/users/courses/:courseId", userAuthentication, (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const course = COURSES.find(
    (course) => course.id === courseId && course.published
  );

  if (course) {
    req.user.purchased.push(courseId);
    res.status(200).json({ message: "course purchased successfully" });
  } else {
    res.status(403).json({ message: "no course found" });
  }
});

// logic to view purchased courses
app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  const CoursesIds = req.user.purchasedCourses;
  const purchasedCourses = [];

  for (let i = 0; i < COURSES.length; i++) {
    if (CoursesIds.indexOf(COURSES[i].id !== -1)) {
      purchasedCourses.push(COURSES[i]);
    }
  }
  res.json({ purchasedCourses });
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
