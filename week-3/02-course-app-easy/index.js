const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
function adminAuth(req, res, next) {
  let admin = ADMINS.find((a) => a.email === req.headers.email && a.password === req.headers.password) 
  if(admin) {
    next()
  } else {
    
    res.status(404).json({message: "not authorized"})
  }
}
const userAuthentication = (req, res, next) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    req.user = user;  // Add user object to the request
    next();
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
};
// Admin routes


app.get('/details', (req, res) => {
  if(ADMINS.length) {
    res.json({ADMINS})
    // console.log(ADMINS)
  } else {
    return res.status(401).send("Unauthorized");
  }
})

app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  // console.log("admin", admin)
  if (ADMINS.find((a) => a.email === admin.email)) {
    res.json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    // console.log("ADMINS", ADMINS)
    res.json({ message: "Admin entered successfully"});
  }
});

app.post('/admin/login', adminAuth,  (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.post('/admin/courses', adminAuth, (req, res) => {
  const course = req.body;

  course.id = Date.now(); // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });

});

app.put('/admin/courses/:courseId', adminAuth, (req, res) => {
  let courseId =  parseInt(req.params.courseId);
  let values = req.body
  if(COURSES.find(a => a.id === courseId)) {
    Object.assign(COURSES, values)
    res.json({message: "course updated successfully"})
  } else {
    res.json({message: "id didn't match"})
  }
  // logic to edit a course

});

app.get('/admin/courses', adminAuth, (req, res) => {
  // logic to get all courses
  res.json({COURSES})
});

// User routes
app.post('/users/signup', (req, res) => {
  // const user = {...req.body, purchasedCourses: []};
  const user = {
    username: req.body.username,
    password: req.body.password,
    purchasedCourses: []
  }
  USERS.push(user);
  res.json({ message: 'User created successfully' });
});

app.post('/users/login', userAuthentication, (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/users/courses', userAuthentication, (req, res) => {
  // COURSES.filter(c => c.published)
  let filteredCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (COURSES[i].published) {
      filteredCourses.push(COURSES[i]);
    }
  }
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', userAuthentication, (req, res) => {
  const courseId = Number(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId && c.published);
  if (course) {
    req.user.purchasedCourses.push(courseId);
    res.json({ message: 'Course purchased successfully' });
  } else {
    res.status(404).json({ message: 'Course not found or not available' });
  }
});

app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
  // const purchasedCourses = COURSES.filter(c => req.user.purchasedCourses.includes(c.id));
  // We need to extract the complete course object from COURSES
  // which have ids which are present in req.user.purchasedCourses
  var purchasedCourseIds = req.user.purchasedCourses; [1, 4];
  var purchasedCourses = [];
  for (let i = 0; i<COURSES.length; i++) {
    if (purchasedCourseIds.indexOf(COURSES[i].id) !== -1) {
      purchasedCourses.push(COURSES[i]);
    }
  }

  res.json({ purchasedCourses });
});
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
