const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {v4: uuidv4} = require('uuid');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const secretKey = 'Test@12345';
app.use(express.json());
app.use(bodyParser.json());

let ADMINS, USERS, COURSES;

// Define mongoose schema
const userSchema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
  purchasedCourse: [{unique: true, type: mongoose.Schema.Types.ObjectId, ref: 'COURSES'}]
});

const adminSchema = new mongoose.Schema({
  username: {type: String},
  password: {type: String},
});

const courseSchema = new mongoose.Schema({
  title: {type: String },
  description: {type: String },
  price: {type: Number},
  imageLink : {type:String},
  published: {type: Boolean}
});

// Define mongo models
ADMINS = mongoose.model('ADMINS', adminSchema);
USERS = mongoose.model("USERS",userSchema );
COURSES = mongoose.model('COURSES', courseSchema);

// connect to mongo db
mongoose.connect('mongodb+srv://vikasbashu:Cb21DWHdt02WyvIc@tycers.o6r8vsu.mongodb.net/CourseBay?retryWrites=true&w=majority', {
  useNewUrlParser: true, useUnifiedTopology: true});



// generate jwt token
const create_token = (payload) => {
  return jwt.sign(payload, secretKey, {algorithm: 'HS256', expiresIn: "1h"});
}

// grab username from token
const token_decrypter = (fieldName, token) => {
  const decodedToken = jwt.verify(token, secretKey);
  if(decodedToken.hasOwnProperty(fieldName))
    return decodedToken[fieldName];
  else return null;  
}

// check for valid credentials
const token_validator = async (token) => {
  let valid = false;
  let valid_account;
  if(! token) return valid;
  token = token.split(" ")[1];
  try{
    const username = token_decrypter('username', token);
    const role = token_decrypter('role', token);
    if(role === 'admin'){
      valid_account = await ADMINS.findOne({username});
    }else{
      valid_account = await USERS.findOne({username});
    }
    if(valid_account) valid = true;
  }catch(err){
    return false;
  }
  return valid;
}

// Authenticate user at middleware level
const authenticator_middleWare = async (req, res, next) => {
  if(req.url.includes('/signup') || req.url.includes('/login')) next();
  else {
    let authenticated = false;
    if(req.url.includes('/admin/')){
      authenticated = await token_validator(req.headers.authorization);
    }else{
      authenticated = await token_validator(req.headers.authorization);
    }
    authenticated ? next() : res.status(401).json({message:"Access denied"});
  }
}
app.use(authenticator_middleWare);

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  try{
    const {username, password} = req.body;
    const existing_account = await ADMINS.findOne({username});
    existing_account && res.status(403).json({message: 'username already exists. Please use another one!'}); 
    if(!existing_account){
      const new_account = new ADMINS(req.body);
      await new_account.save();
      res.status(201).json({message: 'Admin created successfully', token: create_token(req.body)});
    } 
  }catch(err){
    res.status(503).json({message: 'Something went wrong', error:err});
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username, password} = req.headers;
  const valid__credentials = await ADMINS.findOne({username, password});
  valid__credentials && res.status(200).send({ message: 'Logged in successfully', token: create_token({username, role:'admin'})});
  ! valid__credentials && res.status(403).json({message: "Invalid username or password"});
});

app.post('/admin/courses', async (req, res) => {
  // logic to create a course
  //console.log('Creating new Course');
  req.body.id = uuidv4();
  const new_course = new COURSES(req.body);
  await new_course.save();
  res.status(200).json({message: 'Course created successfully', courseId: new_course.id});
});

app.put('/admin/courses/:courseId', async (req, res) => {
  // logic to edit a course
  try{
    const courseId = req.params['courseId'];
  let course_found = await COURSES.findByIdAndUpdate(courseId, req.body, {new: true});
  course_found ? res.status(200).json({message: "Course updatd successfully"}) :res.status(404).json({message:'Invalid course id. Course not found'});
  }catch(err){
    res.status(404).json({message:'Invalid course id. Course not found'});
  }
});

app.get('/admin/courses', async (req, res) => {
  // logic to get all courses
  res.status(200).json({courses: await COURSES.find({})});
});

app.delete('/admin/courses/:courseId', async (req, res) => {
  // delete a course
  try{
    const courseId = req.params['courseId'];
  if(await COURSES.findById(courseId)){
    let course_found = await COURSES.findByIdAndDelete(courseId);
    course_found && res.status(200).json({message: "Course deleted successfully"});
  }else{
    res.status(404).json({message:'Invalid course id. Course not found'});
  }
  }catch(err){
    res.status(404).json({message:'Invalid course id. Course not found'});
  }
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  try{
    const {username, password} = req.body;
    const existing_account = await USERS.findOne({username});
    existing_account && res.status(403).json({message: 'username already exists. Please use another one!'});
    if(!existing_account){
      const new_account = new USERS(req.body);
      await new_account.save();
      res.status(201).json({message: 'User created successfully', token: create_token(req.body)});
    }
  }catch(err){
    res.status(503).json({message: 'Something went wrong', error:err});
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username, password} = req.headers;
  const valid__credentials = await USERS.findOne({username, password});
  valid__credentials && res.status(200).send({ message: 'Logged in successfully', token: create_token({username, role:'user'})});
  ! valid__credentials && res.status(403).json({message: "Invalid username or password"});
});

app.get('/users/courses', async (req, res) => {
  // logic to list all courses
  res.status(200).json({courses: await COURSES.find({published: true})});
});

app.post('/users/courses/:courseId', async (req, res) => {
  // logic to purchase a course
    const purchasedCourseId = req.params["courseId"];
    const course = await COURSES.findById(purchasedCourseId);
    if(course){
      const username = token_decrypter('username', req.headers.authorization.split(' ')[1]);
      const loggedInUser = await USERS.findOne({username});
      if(loggedInUser.purchasedCourse.map(id => id.toString()).includes(purchasedCourseId)){
        res.status(403).json({message: "You've already purchased this course. No need to buy it again."});
      }else{
        loggedInUser.purchasedCourse.push(course);
         await loggedInUser.save(); 
        res.status(200).json({message: 'Course purchased successfully'});
      }
    }else{
      res.status(403).json({message: 'Invalid course id'});
    }
});

app.get('/users/purchasedCourses', async (req, res) => {
  // logic to view purchased courses
  const username = token_decrypter('username', req.headers.authorization.split(' ')[1]);
  const loggedInUser = await USERS.findOne({username}).populate('purchasedCourse');
  loggedInUser && res.status(200).json({purchasedCourses: loggedInUser.purchasedCourse || []});
  ! loggedInUser && res.status(403).json({message: 'User not found'});
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
