const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];

const adminSchema = mongoose.Schema({
  username : String,
  password : String
});

const userSchema = mongoose.Schema({
  username : String,
  password : String,
  purchasedCourses : [{type: mongoose.Types.ObjectId, ref:'Course'}]
});

const courseSchema = mongoose.Schema({
    title : String,
    description : String,
    price : Number,
    imageLink : String,
    published : Boolean
})

const User = mongoose.model('User',userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
// mongoose.connect('mongodb+srv://kirattechnologies:iRbi4XRDdM7JMMkl@cluster0.e95bnsi.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

mongoose.connect('mongodb+srv://akshit:Akki-123@cluster0.jmjzcjf.mongodb.net/Courses',{useNewUrlParser: true, useUnifiedTopology: true, dbName: "Courses" })

const secret = "sdskfhouwgrguo2u1487tfeiqg*EQ&";

function createToken(USER) {
  const toEncrypt = {username: USER.username};
  return jwt.sign(toEncrypt,secret,{expiresIn: '1h'});
};

function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if(!token){
    res.status(401).send('Token not found in headers');
  } else{
    jwt.verify(token, secret,(err, user)=>{
      if(err){
        res.sendStatus(404);
      }
      req.user = user;
    });
    next();
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username, password} = req.body;
  const existingAdmin = await Admin.findOne({username});
  if(existingAdmin){
    res.status(401).send('existing admin');
  }
  else{
    const newAdmin = new Admin({username: username, password : password});
    await newAdmin.save();
    const token = createToken(newAdmin);
    res.json({ 
      message: 'Admin created successfully',
      token
    });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const existingAdmin = await Admin.findOne({username: username, password: password});
  if(existingAdmin){
    const token = createToken(existingAdmin);
    res.json({ 
      message: 'Logged in successfully',
      token
    });
  }
});

app.post('/admin/courses', verifyToken, async (req, res) => {
  // logic to create a course
  const newCourse = new Course(req.body);
  await newCourse.save();
  res.json({ 
    message: 'Course created successfully', courseId: newCourse.id 
  });
});

app.put('/admin/courses/:courseId', verifyToken, async (req, res) => {
  // logic to edit a course
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, {new: true});
  if(course){
    res.json({ message: 'Course updated successfully' });
  }
  else{
    res.send('cannot find course');
  }
});

app.get('/admin/courses', verifyToken, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json(courses);
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  const existingUser = await User.findOne({username : username});
  if(existingUser){
    res.status(401).send('existing admin');
  }
  else{
    const newUser = new User({username: username, password : password});
    await newUser.save();
    const token = createToken(newUser);
    res.json({ 
      message: 'Admin created successfully',
      token
    });
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const existingUser = await User.findOne({username: username, password: password});
  if(existingUser){
    const token = createToken(existingUser);
    res.json({ 
      message: 'Logged in successfully',
      token
    });
  }
});

app.get('/users/courses', verifyToken, async (req, res) => {
  // logic to list all courses
  const courses = await Course.find({published : true});
  res.json(courses);
});

app.post('/users/courses/:courseId', verifyToken, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  if(!course){
    res.status(401).send('Course not found');
  }
  const user = await User.findOne({username: req.user.username});
  if(!user){
    res.status(401).send('User not found');
  }
  user.purchasedCourses.push(course);
  await user.save();
  res.json({ message: 'Course purchased successfully' });
});

app.get('/users/purchasedCourses', verifyToken, async (req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({username: req.user.username}).populate('purchasedCourses');
  res.json(user.purchasedCourses);
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
