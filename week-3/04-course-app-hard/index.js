require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose'); // Provides you api using which you can easily connect to mongo db
const jwt = require('jsonwebtoken');

const app = express();

app.use(express.json());

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

//Define collections
const User = new mongoose.model('User', userSchema)
const Admin = new mongoose.model('Admin', adminSchema)
const Course = new mongoose.model('Course', courseSchema)

mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.jdsajjq.mongodb.net/courses`, { useNewUrlParser: true, useUnifiedTopology: true });

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const {username, password} = req.body;
  const admin = await Admin.findOne({username});
  if(admin){
    res.status(403).send('Admin already exists');
  }else{
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    const authToken = generateTokenAdmin({username, password});
    res.json({ message: 'Admin created successfully', authToken })
  }
});

app.post('/admin/login', async (req, res) => {
  const {username, password} = req.headers;
  const admin = await Admin.findOne({username});
  if(admin){
    const authToken = generateTokenAdmin({username, password});
    res.json({ message: 'Logged in successfully', authToken });
  }else{
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateAdmin, async (req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateAdmin, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body);
  if(course){
    res.json({ message: 'Course updated successfully' });
  }else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authenticateAdmin, async (req, res) => {
  const courses = await Course.find({});
  res.json({ courses });
});

// User routes
app.post('/users/signup', async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if(user){
    res.status(403).send('User already exists');
  }else{
    const user = new User(req.body);
    await user.save();
    const authToken = generateTokenAdmin({username, password});
    res.json({ message: 'User created successfully', authToken })
  }
});

app.post('/users/login', async (req, res) => {
  const {username, password} = req.headers;
  const user = await User.findOne({username});
  if(user){
    const authToken = generateTokenUser({username, password});
    res.json({ message: 'Logged in successfully', authToken });
  }else{
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateUser, async (req, res) => {
  const courses = await Course.find({published : true});
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateUser, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if(course){
    const user = await User.findOne({username: req.user.username});
    if(user){
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    }else{
      res.status(403).json({ message: 'User not found' });
    }
  }else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateUser, async (req, res) => {
  const user = await User.findOne({username: req.user.username}).populate('purchasedCourses');;
  if(user){
    res.json({ purchasedCourses: user.purchasedCourses});
  }else{
    res.status(403).json({ message: 'User not found' });
  }
});

function authenticateAdmin(req, res, next){
  const authHeader = req.headers.authorization;
  if(authHeader === undefined) return res.status(403).send('Forbidden');
  const authToken = authHeader.split(' ')[1];
  jwt.verify(authToken, process.env.ACCESS_SECRET_TOKEN_ADMIN, (err, admin) => {
    if(err) return res.status(403).send('Forbidden');
    req.admin = admin;
    next();
  });
}

function authenticateUser(req, res, next){
  const authHeader = req.headers.authorization;
  if(authHeader === undefined) res.status(403).send('Forbidden');
  const authToken = authHeader.split(' ')[1];
  jwt.verify(authToken, process.env.ACCESS_SECRET_TOKEN_USER, (err, user) => {
    if(err) return res.status(403).send('Forbidden');
    req.user = user;
    next();
  });
}

function generateTokenAdmin(payload){
  return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN_ADMIN, {expiresIn:'1h'});
}

function generateTokenUser(payload){
  return jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN_USER, {expiresIn:'1h'});
}

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
