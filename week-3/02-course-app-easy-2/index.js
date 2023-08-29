const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  //  Check if the username is already taken
  if ( ADMINS.some(admin => admin.username === username)) {
    return res.status(409).json({ error: 'Username is already taken' });
  }
  // Create a new admin user objec
  const newAdmin = {
    username,
    password, 
  };

  // Add the new admin to the ADMINS array
  ADMINS.push(newAdmin);

  return res.status(201).json({ message: 'Admon user created successfully' });

});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const ACTIVE_SESSIONS = [];

  const { username, password} = req.body;
  // Find the admin with the given username
  const admin =   ADMINS.find(admin => admin.username === username);

  //  Check if admin exists and tje password matches
  if (!admin || admin.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  // Generate a session token (for simplicity using a random string)
  
  const sessionToken = Math.random().toString(36).substring(7);

});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const { courseName, instuctor, duration } = req.body;

  //  Create a new course object 
  const newCourse = {
    courseName,
    instuctor,
    duration,
  };

  COURSES.push(newCourse);

  return res.status(201).json( { mesaage: 'Course created successully', course: newCourse });
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const courseId = req.params.courseId;
  const { courseName, instructor, duration } = req.body;

  // Find the index of the course with provides courseId
  const courseIndex = COURSES.findIndex(course => course.courseId === courseId);

  // Check i the course exists
  if ( courseIndex === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Update the course details
  COURSES[courseIndex] = {
    ...COURSES[courseIndex],
    courseName: courseName || COURSES[courseIndex].courseName,
    instructor: instructor || COURSES[courseIndex].instructor,
    duration: duration || COURSES[courseIndex].duration,
  };

  return res.status(200).json({ message: 'Course updated successfully', course: COURSES[courseIndex]});

});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  return res.status(200).json({ courses: COURSES});
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;

  if (USERS.some(user => user.username === username || user.email === email)) {
    return res,status(409).json({ error: 'Username or email already taken'});
  }

  const newUsers = {
    username, 
    email,
    password,
  };

  USERS.push(newUsers);
  
  return res.status(201).json({ message: 'user succesfully created' });

});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const ACTIVE_SESSIONS = [];

  const { username, password } = req.body;

  const user = USERS.find(user => user.user.name === username);

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid credentials '});
  }

  const seesionToken = Math.random().toString(36).substring(7);

  ACTIVE_SESSIONS.push({ username, sessionToken });
  
  return res.status(200).json({ message: 'Login successful', seesionToken});
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  return res.status(200).json({ course: COURSES });
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const username = req.body.username;
  // Find the user and course based on provided username and courseId
  const user = USERS.find( users => user.username === username);
  const course = COURSES.find(course => course.courseId === courseId);

  //  CHeck if user or course does not exist
  if (!user || !course) {
    return res.status(404).json({ error: 'User or course not found' });
  }
  // Check if user already purchased the course
  if (user.purchasedCourse.includes(courseId)) {
    return res.status(400).json({ error: 'User already purchased htis course' });
  }

  // Update user's purchased courses
  user.purchasedCourse.push(courseId);

  return res.status(200).json( { message : 'Course purchased successfully', course: course });
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  return res.status(200).json( purchasedCourse: purchasedCourse )
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
