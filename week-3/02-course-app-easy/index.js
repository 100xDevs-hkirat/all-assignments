const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];
const PURCHASES = [];

// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;
  const admin = ADMINS.find(admin=>{
    return admin.username === username;
  });
  if (admin) {
    res.status(400).send({ message: 'Admin already exists' });
  }
  ADMINS.push({ username, password });
  res.status(201).send('Admin created successfully')
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = ADMINS.find(admin=> {
    return admin.username === username && admin.password === password;
  });
  if (admin) {
    return res.status(200).send( { message: 'Logged in successfully' });
  } else {
    res.status(400).send('Admin doesn\'t exist');
  }
  
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
  const { username, password } = req.headers;
  const { title, description, price, imageLink, published } = req.body;
  const admin = ADMINS.find(admin=>{
    return admin.username === username && admin.password === password;
  });
  if (admin) {
    COURSES.push({ title, description, price, imageLink, published, courseId: COURSES.length + 1 });
    return res.status(201).json( { message: 'Course created successfully', courseId: COURSES.length});
  }
  res.status(400).send('Admin doesn\'t exist');
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
  const { username, password } = req.headers;
  const courseId = parseInt(req.params.courseId);
  const { title, description, price, imageLink, published } = req.body;
  const admin = ADMINS.find(admin=>{
    return admin.username === username && admin.password === password;
  });
  if (admin) {
    let ind = -1;
    for(let i = 0; i < COURSES.length; i++) {
      if (COURSES[i].courseId === courseId) {
        ind = i
        break;
      }
    }
    if (ind === -1 ){
      return res.status(400).send('Course doesn\'t exist');
    }
    COURSES[ind] = { ...COURSES[ind], ...{ title, description, price, imageLink, published }};
    return res.status(201).json( { message: 'Course updated successfully' });
  }
  res.status(400).send('Admin doesn\'t exist');
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
  const { username, password } = req.headers;
  const admin = ADMINS.find(admin=>{
    return admin.username === username && admin.password === password;
  });
  if (admin) {
    return res.status(201).json(COURSES);
  }
  res.status(400).send('Admin doesn\'t exist');
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = USERS.find(user=>{
    return user.username === username;
  });
  if (user) {
    return res.status(400).send('User already exists');
  }
  USERS.push({ username, password });
  res.status(201).send('User created successfully')
});

app.post('/users/login', (req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = USERS.find(user=>{
    return user.username === username && user.password === password;
  });
  if (user) {
    return res.status(200).send('Logged in successfully');
  } else {
    return res.status(400).send('User doesn\'t exist');
  }
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
  const { username, password } = req.headers;
  const user = USERS.find(user=>{
    return user.username === username && user.password === password;
  });
  if (user) {
    return res.status(201).json(COURSES);
  }
  res.status(400).send('User doesn\'t exist');
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
  const { username, password } = req.headers;
  const courseId = parseInt(req.params.courseId);
  const user = USERS.find(user=>{
    return user.username === username && user.password === password;
  });
  const courseExists = COURSES.find(course=>{
    return course.courseId === courseId
  })
  if (!courseExists) {
    return res.status(400).send('Course doesn\'t exist');
  }
  if (user && courseExists) {
    let purchaseInd = -1;
    for (let i = 0; i < PURCHASES.length ; i++) {
      if (PURCHASES[i].username === username) {
        purchaseInd = i;
        break;
      }
    }
    if (purchaseInd === -1) {
      PURCHASES.push({username: user.username, courses: [courseId]})
    }else {
      PURCHASES[purchaseInd].courses.push(courseId);
    }
    return res.status(201).json('Course purchased');
  }
  res.status(400).send('Admin doesn\'t exist');
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
  const { username, password } = req.headers;
  const purchases = PURCHASES.find(purchase=>{
    return purchase.username === username;
  })
  const courses = COURSES.filter(course=>{
    return purchases.courses.includes(course.courseId);
  })
  res.send(courses);

});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
