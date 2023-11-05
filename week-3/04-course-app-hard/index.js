const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();
const secret_key_admin = 'jh4jhc4jcvj5c5vnvvkjbojh909y89y489086rejjn23567jynn';
const secret_key_user = 'oihiufvmk6994639yoy498y9t2gekjbvkjunbvswet87543scgf';
const ADMIN_ROLE = 'ADMIN';
const USER_ROLE = 'USER';
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: Schema.Types.ObjectId, ref: 'Course' }]
})

const adminSchema = new Schema({
  username: String,
  password: String
})

const courseSchema = new Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
})

//Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

app.use(bodyParser.json());

let USERS = [];
let COURSES = [];

mongoose.connect('mongodb+srv://abhilash301267:Abhilash%401234@cluster0.gdb64q8.mongodb.net/course-selling-website').then(() => console.log('Connected to DB')).catch(err => console.log(err));

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

function authenticateAdminJWT(req, res, next) {
  const token = req.headers.authorization &&
    req.headers.authorization.split(' ')[1];
  if (token) {
    console.log(token);
    jwt.verify(token, secret_key_admin, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
        console.log(err);
      }
      else {
        Admin.findOne({ username: decoded.username }).then(admin => {
          if (admin) {
            req.admin = admin;
            next();
          }
          else {
            res.sendStatus(403).json({ message: 'Couldnt find a valid user while creating jwt' });
          }
        });
      }
    })
  }
  else {
    return res.sendStatus(403)
  }
}

function authenticateUserJWT(req, res, next) {
  const token = req.headers.authorization &&
    req.headers.authorization.split(' ')[1];
  if (token) {
    jwt.verify(token, secret_key_user, (err, decoded) => {
      if (err) {
        res.status(403).json({ message: err.message });
        console.log(err);
      }
      else {
        User.findOne({ username: decoded.username }).then(user => {
          if (user) {
            req.user = user;
            next();
          }
          else {
            res.status(403).json({ message: 'Couldnt find a valid user while creating jwt' });
          }
        });
      }
    })
  }
  else {
    return res.sendStatus(403)
  }
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
app.post('/admin/signup', checkUsernamePasswordValidityBody, async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: `User with same username already exists.` });
  }
  else {
    const obj = { username, password };
    const newAdmin = new Admin(obj);
    await newAdmin.save();
    const token = generateJWT(newAdmin.username, ADMIN_ROLE);
    res.json({ message: 'Admin created', token });
    console.log('New Admin created: ' + JSON.stringify(newAdmin));
  }
});

app.post('/admin/login', checkUsernamePasswordValidityHeader, async (req, res) => {
  const admin = await Admin.findOne({ username: req.headers.username, password: req.headers.password })
  if (!admin)
    res.status(403).send('User not found');
  else {
    const token = generateJWT(admin.username, ADMIN_ROLE);
    res.json({ message: 'Admin logged in', token });
  }
});

app.post('/admin/courses', authenticateAdminJWT, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  COURSES.push(course);
  res.json({ message: 'course created successfully', courseID: course.id });
  console.log('New course created: ', JSON.stringify(course));
});

app.put('/admin/courses/:courseId', authenticateAdminJWT, async (req, res) => {
  console.log(req.params.courseId);
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (!course) {
      res.status(403).send('Course not found');
      return;
    }
    else {
      console.log(`updated cpurse:\n${JSON.stringify(course)}`);
      res.json({ message: 'couse updated successfully', course });
    }
  }
  catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
}
);


app.get('/admin/courses', authenticateAdminJWT, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', checkUsernamePasswordValidityBody, async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username })
  if (user) {
    res.status(403).json({ message: 'user exists' });
  }
  else {
    console.log(username);
    const obj = { username, password, purchasedCourses: [] };
    console.log(JSON.stringify(obj));
    const newUser = new User(obj);
    await newUser.save();
    USERS.push(newUser);
    const token = generateJWT(username, USER_ROLE);
    res.json({ message: 'New user created', token });
    console.log(JSON.stringify(newUser));
  }
});

app.post('/users/login', checkUsernamePasswordValidityHeader, async (req, res) => {
  const user = await User.findOne({ username: req.headers.username, password: req.headers.password })
  if (!user) {
    res.status(403).json({ message: 'Invalid user' });
  }
  else {
    const token = generateJWT(user.username, USER_ROLE);
    res.json({ message: 'user logged in', token });
    console.log(user);
  }
});

app.get('/users/courses', authenticateUserJWT, async (req, res) => {
  const courses = await Course.find({ published: true });
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateUserJWT, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    if (!req.user.purchasedCourses.some(purchasedCourse => purchasedCourse.toString() === req.params.courseId)) {
      req.user.purchasedCourses.push(course.id);
      await req.user.save();
      res.json({ message: 'course purchased successfully', user: req.user });
    }
    else {
      res.json({ message: 'course already purchased' });
    }
  }
  else {
    res.status(403).json({ message: "course not found" });
  }
});

app.get('/users/purchasedCourses', authenticateUserJWT, async (req, res) => {
  const user = await User.findById(req.user.id).populate('purchasedCourses')
  res.json({ purchasedCourses: user.purchasedCourses || [] });
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
