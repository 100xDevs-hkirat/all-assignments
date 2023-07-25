const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

app.get("/", (req, res) => {
  res.json({ message: "Home route" });
});

const adminAuthentication = (req, res, next) => {
  const { username, password } = req.body;

  const admin = ADMINS.find(
    (a) => (a.username === username) & (a.password === password)
  );

  if (admin) {
    next()
  } else (
    res.status(403).json({ message : "Admin authentication has failed"})
  )
};


const userAuthentication = (req, res, next) => {
  const { email, password } = req.body
  const user = USERS.find(e => e.email === email & e.password === password)
  if (user) {
    next()
  } else {
    req.user = user
    res.status(403).json({ message: "User does not exist"})
  }
}

// Admin routes
app.post("/admin/signup", (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find((a) => a.username === admin.username);

  if (existingAdmin) {
    res.status(403).json({ message: "Admin already exists" });
  } else {
    ADMINS.push(admin);
    res.json({ message: "Admin signup successful" });
  }
});

app.post("/admin/login", adminAuthentication, (req, res) => {
  // logic to log in admin
  res.json({ message : "Admin logged in successfully"})
});

app.post("/admin/courses", (req, res) => {
  // logic to create a course
  const course = req.body

  course.id = Date.now()

  COURSES.push(course)
  res.json({ message : "Course added succesfully haha", courseId : course.id})

});

app.put("/admin/courses/:courseId", (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId)
  const course = COURSES.find(c => c.id === courseId)

  if (course){
    Object.assign(course, req.body)
    res.json({ message: " Course updated succesfully"})
  } else {
    res.status(400).json({ message : "Course not found"})
  }


});

app.get("/admin/courses", (req, res) => {
  // logic to get all courses
  res.json({ courses:  COURSES})
});


// User routes
app.post("/users/signup", (req, res) => {
  // logic to sign up user
  const user = req.body
  const existingUser = USERS.find( a=> a.email === user.email)
  if ( existingUser){
    res.json({ message : "User already exists"})
  } else {
    USERS.push(user)
    res.json({ message : "User sign up successfull"})
  }
});

app.post("/users/login", userAuthentication, (req, res) => {
  // logic to log in user
  res.json({ message: "User logged in succesfully"}) 
});

app.get("/users/courses", userAuthentication, (req, res) => {
  // logic to list all courses
  res.json({ courses: COURSES.find(c => c.published)})
});

app.post("/users/courses/:courseId",userAuthentication, (req, res) => {
  // logic to purchase a course
  const courseId = Number(req.params.courseId)
  const course = COURSES.find(c => c.id == courseId && c.published)

  if (course){
    req.user.purchasedCourses.push(courseId)
    res.json({ message : "Course purchased successfully"})
  } else {
    req.status(404).json({ message:  "Course not found or available"})
  }
});

app.get("/users/purchasedCourses", userAuthentication, (req, res) => {
  // logic to view purchased courses
  const purchasedCourses = COURSES.filter(c=> req.user.purchasedCourses.include(c.id) )
  res.json({ purchasedCourses})
});

app.listen(PORT, () => {
  console.log(`Server is listening on port - ${PORT}`);
});
