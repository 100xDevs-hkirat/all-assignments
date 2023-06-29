const express = require('express');
const jwt = require('jsonwebtoken');
const { auth } = require('./middleware');

const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const PURCHASES = [];

const getLoginToken = (username) => {
  const token = jwt.sign({
    username
  }, 'secret', { expiresIn: '1h' });
  return token;
}

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find(admin=>{
    return admin.username === username;
  });
  if (admin) {
    res.status(400).json({message: 'Admin already exists'});
  }
  ADMINS.push({ username, password });
  const token = getLoginToken(username);
  res.status(201).json({message: 'Admin created successfully', token})
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(admin=>{
    return admin.username === username && admin.password === password;
  });
  if (admin) {
    const token = getLoginToken(username);
    return res.status(200).json({message: 'Logged in successfully', token});
  } else {
    res.status(400).json({message: 'Admin doesn\'t exist'});
  }
  
});

app.post('/admin/courses', auth, (req, res) => {
  // logic to create a course
  const { title, description, price, imageLink, published } = req.body;
  COURSES.push({ title, description, price, imageLink, published, courseId: COURSES.length + 1 });
  return res.status(201).json( { message: 'Course created successfully', courseId: COURSES.length});
});

app.put('/admin/courses/:courseId', auth, (req, res) => {
  // logic to edit a course
  const courseId = parseInt(req.params.courseId);
  const { title, description, price, imageLink, published } = req.body;
  
  let ind = -1;
  for(let i = 0; i < COURSES.length; i++) {
    if (COURSES[i].courseId === courseId) {
      ind = i
      break;
    }
  }
  if (ind === -1 ){
    return res.status(400).json( { message: 'Course doesn\'t exist' });
  }
  COURSES[ind] = { ...COURSES[ind], ...{ title, description, price, imageLink, published }};
  return res.status(201).json( { message: 'Course updated successfully' });  
});

app.get('/admin/courses', auth, (req, res) => {
  // logic to get all courses
  return res.status(201).json(COURSES);
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = USERS.find(user=>{
    return user.username === username;
  });
  if (user) {
    return res.status(400).json( { message: 'User already exists' });
  }
  USERS.push({ username, password });
  const token = getLoginToken(username);
  res.status(201).json({message: 'User created successfully', token})
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(user=>{
    return user.username === username && user.password === password;
  });
  if (user) {
    const token = getLoginToken(username);
    return res.status(200).json( { message: 'Logged in successfully', token });
  } else {
    return res.status(400).json( { message: 'User doesn\'t exist'});
  }
});

app.get('/users/courses', auth, (req, res) => {
  // logic to list all courses
  return res.status(201).json(COURSES);
  res.status(400).json({ message: 'User doesn\'t exist'} );
});

app.post('/users/courses/:courseId', auth, (req, res) => {
  // logic to purchase a course
  const courseId = parseInt(req.params.courseId);
  const user = USERS.find(user=>{
    return user.username === req.username;
  });
  const courseExists = COURSES.find(course=>{
    return course.courseId === courseId
  })
  if (!courseExists) {
    return res.status(400).json({ message: 'Course doesn\'t exist'});
  }
  if (user && courseExists) {
    let purchaseInd = -1;
    for (let i = 0; i < PURCHASES.length ; i++) {
      if (PURCHASES[i].username === req.username) {
        purchaseInd = i;
        break;
      }
    }
    if (purchaseInd === -1) {
      PURCHASES.push({username: user.username, courses: [courseId]})
    }else {
      PURCHASES[purchaseInd].courses.push(courseId);
    }
    return res.status(201).json({ message: 'Course purchased'});
  }
  res.status(400).json({ message: 'User doesn\'t exist'});
});

app.get('/users/purchasedCourses', auth, (req, res) => {
  // logic to view purchased courses
  const purchases = PURCHASES.find(purchase=>{
    return purchase.username === req.username;
  })
  const courses = COURSES.filter(course=>{
    return purchases.courses.includes(course.courseId);
  })
  res.json(courses);

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
