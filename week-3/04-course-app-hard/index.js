const express = require('express');
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors")

const app = express();


app.use(cors())
app.use(express.json());

const SECRET = 'hduiheyhyugbfihuhfiuhighuasuhiuahd8uhhioihos'

//define db Schemas
const userSchema = mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

// Define models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

//connect to db
mongoose.connect("mongodb+srv://sujitdb:sujay1234@cluster0.opya8z3.mongodb.net/", {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   dbName: "CourseApp"
});

async function isAuthenticate(req, res , next){

  let authHeader = req.headers.authorization;
  console.log(authHeader)

  if(authHeader){
    let token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, async (err, user) =>{
      if(err){
        res.status(401).json({message : "Invalid Token"})
      }
      try {
        if(user.role === 'admin'){
          let admin = await Admin.findOne({username: user.username})
          if(admin){
            req.user = admin
            next()
          }
          else{
            res.status(401).json({message : "Invalid Credentials"})
          }
        }
  
        else{
          let userdb = await User.findOne({username: user.username})
          if(userdb){
            req.user = userdb
            next()
          }
          else{
            res.status(401).json({message : "Invalid Credentials"})
          }
        }
      } catch (error) {
        console.log(error)
        res.status(500)
      }
    })
  }
  else{
    res.status(401).json({message : "Invalid Token"})
  }
  
}


// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username , password} = req.body;
  
  if(!username || !password){
    res.status(400).json({
      message: "Invalid Body"
    })
  }

  try {
    const admin = await Admin.findOne({username})
    if(admin){
      res.status(403).json({ message: 'Admin already exists' });
    }
    else{
      const obj = { username: username, password: password };
      const newAdmin = new Admin(obj);
      newAdmin.save();
      const token = jwt.sign({ username: username, role: 'admin' }, SECRET, { expiresIn: 3600 });
      res.json({ message: 'Admin created successfully', token: token });
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
  
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username , password} = req.headers;

  try {
    const admin = await Admin.findOne({ username, password });
    if (admin) {
      const token = jwt.sign({ username: username, role: 'admin' }, SECRET, { expiresIn: 600 });
      res.json({ message: 'Logged in successfully', token: token });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
  
});


app.post('/admin/courses', isAuthenticate , async (req, res) => {
  // logic to create a course
  let {title, description, price, imageLink, published} = req.body
  try {

    const course = await Course.findOne({title})

    if(course){
      res.status(403).json({ message: 'Course already exists' });
    }
    else{
      const obj = {title: title, description:description, price: price, imageLink: imageLink, published: published}
      const newCourse = new Course(obj);
      await newCourse.save()
      let response = {
        message : "Course created successfully",
        courseId : newCourse.id
      }
    
      res.json(response)
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});


app.put('/admin/courses/:courseId', isAuthenticate, async (req, res) => {
  // logic to edit a course
  try {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
    
});

app.get('/admin/me', isAuthenticate, async (req, res) => {
  // logic to get all courses
  try {
    
    res.json({user : req.user.username})
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});

app.get('/admin/courses', isAuthenticate, async (req, res) => {
  // logic to get all courses
  try {
    const allCourses = await Course.find({})
    res.json({courses : allCourses})
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});

app.get('/admin/course/:courseId', isAuthenticate, async (req, res) => {
  // logic to get all courses

  let courseId = req.params.courseId;

  try {
    const course = await Course.findById(courseId).exec()
    res.json({course : course})
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username , password} = req.body;
  
  if(!username || !password){
    res.status(400).json({
      message: "Invalid Body"
    })
  }

  try {
    const user = await User.findOne({username})
    if(user){
      res.status(403).json({ message: 'User already exists' });
    }
    else{
      const obj = { username: username, password: password };
      const newUser = new User(obj);
      newUser.save();
      const token = jwt.sign({ username: username, role: 'user' }, SECRET, { expiresIn: 600 });
      res.json({ message: 'User created successfully', Token: token });
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
  
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username , password} = req.headers;
  
  const user = await User.findOne({ username, password });
  if (user) {
    const token = jwt.sign({ username: username, role: 'user' }, SECRET, { expiresIn: 600 });
    res.json({ message: 'Logged in successfully', token: token });
  } else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
  
});

app.get('/users/courses', isAuthenticate, async (req, res) => {
  // logic to list all courses
  try {
    const allCourses = await Course.find({published: true})
    res.json({courses : allCourses})
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});


app.post('/users/courses/:courseId', isAuthenticate, async (req, res) => {
  // logic to purchase a course
  let courseId = req.params.courseId;
  let User = req.user
  try {
    const course = await Course.findById(courseId).exec();

    if(course){
      User.purchasedCourses.push(courseId);
      await User.save()
      res.json({message : "Course purchased successfully"})
    }
    else{
      res.status(404).json({message : "Course not Found"})
    }
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});


app.get('/users/purchasedCourses', isAuthenticate, async (req, res) => {
  // logic to view purchased courses
  try {
    let purchasedCourses = req.user.purchasedCourses;
    let courses = []
    for(let i=0; i<purchasedCourses.length; i++){
      let course = await Course.findOne({_id : purchasedCourses[i]})
      courses.push(course)
    }
    res.json({purchasedCourses: courses})
  } catch (error) {
    console.log(error)
    res.status(500)
  }
});


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

