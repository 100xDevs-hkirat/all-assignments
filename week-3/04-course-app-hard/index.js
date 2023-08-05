const express = require('express');
const app = express();
const mongoose = require("mongoose");
const password = 220104008;
const ADMINS_SECRET_KEY = "2003";
const USERS_SECRET_KEY = "2018";

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

// Schemas
const AdminSchemas = mongoose.Schema({
  username: String,
  password: String,
  courses: [{
    typeof: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }]
}, {
  timestamp: true
});

const CourseSchema = mongoose.Schema({
  title: String, 
  description: String, 
  price: Number, 
  imageLink: String, 
  published: Boolean
});

const UserSchema = mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{
    typeof: mongoose.Schema.Types.ObjectId,
    ref:'Course'
  }]
});


// Models
const ADMINS = mongoose.model('COURSE_ADMINS', AdminSchemas);
const COURSES = mongoose.model('COURSES', CourseSchema);
const USERS = mongoose.model('COURSE_USERS', UserSchema);


// Helper Functions
mongoose.connect(`mongodb+srv://admin-akash:${password}@cluster0.kcycili.mongodb.net/courses`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const isAdmin = (username, password) => {
  const flag = ADMINS.findOne({username});
  if (flag == undefined) {
    return 0;
  }
  if (flag.password === password) {
    return { ...flag, pass: true }
  }
  return { ...flag, pass: false };
}

function generateRandomId(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let randomId = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charactersLength);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}

const editCourse = (courseId, body) => {
  for (let i in COURSES) {
    if (COURSES[i].courseId === courseId) {
      if (body.title != '' || body.title != undefined) {
        COURSES[i].title = body.title;
      }
      if (body.description != '' || body.description != undefined) {
        COURSES[i].description = body.description;
      }
      if (body.price != '' || body.price != undefined) {
        COURSES[i].price = body.price;
      }
      if (body.imageLink != '' || body.imageLink != undefined) {
        COURSES[i].imageLink = body.imageLink;
      }
      if (body.published != '' || body.published != undefined) {
        COURSES[i].published = body.published;
      }
      return 1;
    }
  }
  return 0;
}

const purchaseCourse = (courseId, userId) => {
  const course = COURSES.findById(courseId);
  if (course == undefined) {
    return 0;
  }
  const user = USERS.findById(userId);
  course.purchaser.push({ userId });
  user.purchasedCourses.push({ course });
  return 1;
}

const isUser = (username, password) => {
  const flag = USERS.findOne({username});
  if (flag == undefined) {
    return 0;
  }
  if (flag.password === password) {
    return { ...flag, pass: true }
  }
  return { ...flag, pass: false };
}


// Middleware
const adminTokenAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization) {
    return res.status(401).json({ message: "Unauthorized :)" })
  }
  const decoded = jwt.verify(authorization, ADMINS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden :)" })
    }
    return decoded;
  });
  req.user = decoded;
  next();
}
const userTokenAuth = (req, res, next) => {
  const { authorization } = req.headers;
  const decoded = jwt.verify(authorization, USERS_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Unauthorized :)" })
    }
    return decoded;
  });
  req.user = decoded;
  next();
}


// Admin routes
app.post('/admin/signup', (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  if(!username || username == '' || !password || password == '') {
    return res.status(400).json({message: "Bad fetch request"});
  }
  const courses = [];
  const admin = {username, password, courses};
  const isAdmin = ADMINS.find(a => a.username == username);
  if(isAdmin != undefined) {
    return res.status(400).json({message: "Username already exixts :("});
  }
  ADMINS.push(admin);
  return res.status(200).json({
    message: 'Admin created successfully'
  });
});

app.post('/admin/login', (req, res) => {
  // logic to log in admin
});

app.post('/admin/courses', (req, res) => {
  // logic to create a course
});

app.put('/admin/courses/:courseId', (req, res) => {
  // logic to edit a course
});

app.get('/admin/courses', (req, res) => {
  // logic to get all courses
});

// User routes
app.post('/users/signup', (req, res) => {
  // logic to sign up user
});

app.post('/users/login', (req, res) => {
  // logic to log in user
});

app.get('/users/courses', (req, res) => {
  // logic to list all courses
});

app.post('/users/courses/:courseId', (req, res) => {
  // logic to purchase a course
});

app.get('/users/purchasedCourses', (req, res) => {
  // logic to view purchased courses
});

connect();

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
