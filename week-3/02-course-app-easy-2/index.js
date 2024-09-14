const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

//how to check if request is from login route or any other route
  //soln  found out at login auth token is genrated so no need to put it behind middleware
  //i.e. user is loggig in for first time or already logged in
  //soln make another middle ware for authentication token and attach it 
const generateAuthToken = (role)=>{
  const payload = {role : role.username};
  console.log({payload : payload});
  return token = jwt.sign(payload,'SeCret',{expiresIn:'1h'});
}

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, 'SeCret', (err, user) => {
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
app.post('/admin/signup', (req, res) => {
  const admin = req.body;
  const existingAdmin = ADMINS.find(a => a.username === admin.username);
  if (existingAdmin) {
    res.status(403).json({ message: 'Admin already exists' });
  } else {
    ADMINS.push(admin);
    const jwToken = generateAuthToken(admin);
    res.json({ message: 'Admin created successfully' ,token: jwToken});
  }
});

app.post('/admin/login', (req, res) => {
  const {username,password} = req.headers;
  const validAdmin = ADMINS.find(a=>a.username == username && a.password == password);
  if(validAdmin){
    const jwtToken = generateAuthToken();
    res.json({ message: 'Logged in successfully' });
  }else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
});

app.post('/admin/courses', authenticateJwt,(req, res) => {
  const course = req.body;

  course.id = COURSES.length +1; // use timestamp as course ID
  COURSES.push(course);
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId',authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    Object.assign(course, req.body);
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses',authenticateJwt, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', (req, res) => {
  const user = {...req.body, purchasedCourses: []};
  const existingUser = USERS.find(u =>u.username === user.username);
  if(existingUser){
    res.status(403).json({ message: 'User already exists' });
  }else{
    USERS.push(user);
    const token = generateAuthToken(user);
    res.json({ message: 'User created successfully' });  
  }
});

app.post('/users/login', (req, res) => {
  const { username, password } = req.headers;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = generateJwt(user);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'User authentication failed' });
  }
});

app.get('/users/courses',authenticateJwt, (req, res) => {
  let filteredCourses = COURSES.filter(c=>c.published);
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId',authenticateJwt, (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = COURSES.find(c => c.id === courseId);
  if (course) {
    const user = USERS.find(u => u.username === req.user.username);
    if (user) {
      if (!user.purchasedCourses) {
        user.purchasedCourses = [];
      }
      user.purchasedCourses.push(course);
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses',authenticateJwt, (req, res) => {
  const user = USERS.find(u => u.username === req.user.username);
  if (user && user.purchasedCourses) {
    res.json({ purchasedCourses: user.purchasedCourses });
  } else {
    res.status(404).json({ message: 'No courses purchased' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
