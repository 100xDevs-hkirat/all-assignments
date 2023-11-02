const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const secret_key_admin = 'jh4jhc4jcvj5c5vnvvkjbojh909y89y489086rejjn23567jynn';
const secret_key_user = 'oihiufvmk6994639yoy498y9t2gekjbvkjunbvswet87543scgf';
const ADMIN_ROLE = 'ADMIN';
const USER_ROLE = 'USER';
app.use(bodyParser.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

function generateJWT(username, role) {
  const payload = { username, role };
  return jwt.sign(payload, role === USER_ROLE ? secret_key_user : secret_key_admin, { expiresIn: '1h' });
}

function checkUsernamePasswordValidityBody(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.send(`Password or Username is empty. \nUsername :${req.body.username}, \npasswprd: ${req.body.password}`, 410);
    return;
  }
  else next();
}

function checkUsernamePasswordValidityHeader(req, res, next) {
  if (!req.headers.username || !req.headers.password) {
    res.send(`Password or Username is empty`, 410);
    console.log(`Username :${req.headers.username}, \npasswprd: ${req.headers.password}`)
    return;
  }
  else next();
}

function authenticateAdmin(req, res, next) {
  const admin = ADMINS.find(admin => admin.username === req.headers.username);
  if (!admin) res.status(403).send('User not found');
  else if (admin.password !== req.headers.password)
    res.status(401).send('Invalid Password');
  else {
    req.admin = admin;
    next();
  }
}

function authenticateAdminJWT(req, res, next) {
  const token = req.headers.authorization &&
    req.headers.authorization.split(' ')[1];
  if (token) {
    console.log(token);
    jwt.verify(token, secret_key_admin, (err, decoded) => {
      if (err){
        res.sendStatus(403);
        console.log(err);
      } 
      else {
        req.admin = ADMINS.find(a => a.username === decoded.username);
        next();
      }
    })
  }
  else {
    return res.sendStatus(403)
  }
}

function authenticateUser(req, res, next) {
  const user = USERS.find(u => u.username === req.headers.username);
  if (!user) res.status(403).send('User not found');
  else if (user.password !== req.headers.password) res.status(401).send('Invalid Password');
  else {
    req.user = user;
    next();
  }
}

function checkAdminInDatabase(req, res, next) {
  if (ADMINS.some(admin => admin.username === req.body.username)) {
    res.send(`User with same username already exists.`, 409);
    return;
  }
  else next();
}

function checkUserInDatabase(req, res, next) {
  if (USERS.some(user => user.username === req.body.username)) {
    res.send(`User with same username already exists.`, 409);
    return;
  }
  else {
    req.body.user = { username: req.body.username, password: req.body.password }
    next();
  }
}


// Admin routes
app.post('/admin/signup', checkUsernamePasswordValidityBody, checkAdminInDatabase, (req, res) => {
  const id = Date.now();
  const username = req.body.username;
  const password = req.body.password;
  const newAdmin = {
    id: id,
    username: username,
    password: password
  }
  ADMINS.push(newAdmin);
  const token = generateJWT(newAdmin.username, ADMIN_ROLE);
  res.json({ message: 'Admin created', token });
  console.log('New Admin created: ' + JSON.stringify(newAdmin));
});

app.post('/admin/login', checkUsernamePasswordValidityHeader, (req, res) => {
  const admin = ADMINS.find(admin => admin.username === req.headers.username);
  if (!admin)
    res.status(403).send('User not found');
  else if (admin.password !== req.headers.password)
    res.status(401).send('Invalid Password');
  else {
    const token = generateJWT(admin.username, ADMIN_ROLE);
    res.json({ message: 'Admin logged in', token });
  }
});

app.post('/admin/courses', authenticateAdminJWT, (req, res) => {
  const course = req.body;
  course.id = Date.now();
  COURSES.push(course);
  res.json({ message: 'course created successfully', courseID: course.id });
  console.log('New course created: ', JSON.stringify(course));
});

app.put('/admin/courses/:courseId', authenticateAdminJWT, (req, res) => {
  console.log(req.params.courseId);
  const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
  if (!course) {
    res.status(403).send('Course not found');
    return;
  }
  else {
    Object.assign(course, req.body);
    console.log(`updated cpurse:\n${JSON.stringify(course)}`);
    res.send('couse updated successfully');
  }
});


app.get('/admin/courses', authenticateAdminJWT, (req, res) => {
  res.json({ courses: COURSES });
});

// User routes
app.post('/users/signup', checkUsernamePasswordValidityBody, checkUserInDatabase, (req, res) => {
  req.body.user.id = Date.now();
  req.body.user.purchasedCourses = [];
  USERS.push(req.body.user);
  res.send('New user created');
  console.log(`new user created:\n${JSON.stringify(req.body.user.id)}`);
});

app.post('/users/login', checkUsernamePasswordValidityHeader, authenticateUser, (req, res) => {
  res.json({ message: 'user logged in' });
  console.log(`user logged in.\n user: ${JSON.stringify(req.user)}`);
});

app.get('/users/courses', checkUsernamePasswordValidityHeader, authenticateUser, (req, res) => {
  res.json({ courses: COURSES.filter(c => c.published) });
});

app.post('/users/courses/:courseId', checkUsernamePasswordValidityHeader, authenticateUser, (req, res) => {
  const course = COURSES.find(c => c.id === parseInt(req.params.courseId));
  if (course) {
    if (req.user.purchasedCourses.indexOf(course.id) === -1) {
      req.user.purchasedCourses.push(course.id);
      res.json({ message: 'course purchased successfully' });
      console.log(`course list: ${req.user.purchasedCourses.toString()}`);
    }
    else {
      res.json({ message: 'course already purchased' });
    }
  }
  else {
    res.status(403).json({ message: "course not found" });
  }
});

app.get('/users/purchasedCourses', checkUsernamePasswordValidityHeader, authenticateUser, (req, res) => {
  res.json({ purchasedCourses: COURSES.filter(c => req.user.purchasedCourses.includes(c.id) && c.published) })
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
