const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());

const secretKey = "BatMaN1@@8";
const user_secretKey = "I@aMBaTman";



// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

// Define mongoose models
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);


// / Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
const password = encodeURIComponent('1228@Dil'); // URL-encode the password
mongoose.connect('mongodb+srv://dileepkumar1228:' + password + '@cluster0.i1sczuq.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Courses" });



const generateJwt_admin = (user) => {
  const payload = {username : user.username, role: 'admin' };
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};


const authJWT_admin = (request, response, next)=>{
  const authHeader = request.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[1]; // since authorization fron header have an additional string at start
    jwt.verify(token, secretKey, (err, user)=>{
      if(err){
        response.sendStatus(403);
      }
      request.user = user;
      next();
    });
  }
  else{
    response.sendStatus(401);
  }
}

const generateJwt_user= (user) => {
  const payload = {username : user.username, role: 'user' };
  return jwt.sign(payload, user_secretKey, { expiresIn: '1h' });
};


const authJWT_user = (request, response, next)=>{
  const authHeader = request.headers.authorization;

  if(authHeader){
    const token = authHeader.split(' ')[1]; // since authorization fron header have an additional string at start
    jwt.verify(token, user_secretKey, (err, user)=>{
      if(err){
        response.sendStatus(403);
      }
      request.user = user;
      next();
    });
  }
  else{
    response.sendStatus(401);
  }
}



// POST /admin/signup
//    Description: Creates a new admin account.
//    Input: { username: 'admin', password: 'pass' }
//    Output: { message: 'Admin created successfully', token: 'jwt_token_here' }

// Admin routes
app.post('/admin/signup', async(req, res) => {
  // logic to sign up admin
  const { username, password } = req.body;

  const admin = await Admin.findOne({username});

  if(admin){
    res.status(403).json({ message: 'Admin already exists' });
  }
  else{
    const newAdmin = new Admin({username, password});
    await newAdmin.save();
    const token = generateJwt_admin({username, password});
    res.json({ message: 'Admin created successfully', token });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const isAdmin = await Admin.findOne({ username, password });

  if(isAdmin){
    const token = generateJwt_admin({username, password});
    res.json({message: 'Logged in successfully', token});
  }
  else{
    res.status(403).json({message: 'Invalid username or password'});
  }

});

app.post('/admin/courses', authJWT_admin, async(req, res) => {
  // logic to create a course
  var data = req.body;
  const course = new Course(data);
  await course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', authJWT_admin, async(req, res) => {
  // logic to edit a course
  var course = await Course.findByIdAndUpdate(req.params.courseId, req.body,{new : true});

  if(course){
    res.json({ message: 'Course updated successfully' });
  }
  else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', authJWT_admin,async (req, res) => {
  // logic to get all courses
  const course = await Course.find({});
  res.json({ course });
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  console.log(username);
  console.log(password);

  const user = await User.find({username});

  if(user.length > 0){
    res.status(403).json({ message: 'User already exists' });
  }
  else{
    const newUser = new User({username, password});
    await newUser.save();
    const token = generateJwt_user({ username, password });
    res.json({ message: 'User created successfully', token });
  }
});

app.post('/users/login', async(req, res) => {
  // logic to log in user
  const { username, password } = req.body;
  const isUser = await User.find({username, password});

  if(isUser){
    const token = generateJwt_user({ username, password });
    res.json({ message: 'Logged in successfully', token });
  }
  else{
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authJWT_user, async(req, res) => {
  // logic to list all courses
  var data = await Course.find({published: true});
  res.json({data});
});

app.post('/users/courses/:courseId', authJWT_user, async (req, res) => {
  // logic to purchase a course
  const course = await Course.findById(req.params.courseId);
  console.log(course);

  if(course){
    const user = await User.findOne({username: req.user.username});

    if(user){
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    }
    else {
      res.status(403).json({ message: 'User not found' });
    }
  }
  else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authJWT_user, async (req, res) => {
  // logic to view purchased courses
  var user = await User.findOne({username : req.user.username}).populate('purchasedCourses');

  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
