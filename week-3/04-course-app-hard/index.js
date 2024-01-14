const express = require('express');
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = express();

app.use(express.json()); // to read body

const SECRET = 'wow,wow,Encryption'

 // Mongoose Schemas

 const userSchema = new mongoose.Schema({
  username : {type : String}, //below is same
  password: String,
  purchasedCourses : [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
 });

 const adminSchema = new mongoose.Schema({
  username : String,
  password : String
 });

 const courseSchema = new mongoose.Schema({
  title : String,
  description : String,
  price : Number,
  imageLink : String,
  published : Boolean
 });


//Defining mongoose models 

const User = mongoose.model('User',userSchema);
const Admin = mongoose.model('Admin',adminSchema);
const Course = mongoose.model('Course', courseSchema);

// middleware for authentication using Jwt

function authenticateJwt(req,res,next){
  const authHeader = req.headers.authorization;
  if(authHeader){
    const token = authHeader.split(" ")[1];
    jwt.verify(token,SECRET,(err,user)=>{
      if(err){
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    })
  }
  else{
    res.sendStatus(401);
  }
}

//connecting to MongoDB 

mongoose.connect('mongodb+srv://naman19feb:YnuqdC_aiWj5kcn@cluster0.hl1az2k.mongodb.net/',{useNewUrlParser : true, useUnifiedTopology: true, dbName:"courses"});




// Admin routes
app.post('/admin/signup', async (req, res) => {
  const {username,password} = req.body;
  const admin = await Admin.findOne({username : username});
  if(admin){
    res.send("User Already Exsist!")
  }
  else{
    const obj = {username : username, password : password};
    const newAdmin = new Admin(obj);
    await newAdmin.save();
    const token = jwt.sign({username, role: 'admin'},SECRET,{expiresIn : '1h'});
    res.json({message : 'Admin created Successfully', token})
  }
});

app.post('/admin/login', async (req, res) => {
  const {username, password} = req.body;
  const admin = await Admin.findOne({username: username, password: password});
  if(admin){
    const token = jwt.sign({username , role:"admin"},SECRET,{expiresIn:"1h"});
    res.json({message : "Login Successfull!", token})
  }
  else{
    res.status(403).json({message : 'Wrong credentials'})
  }

});

app.post('/admin/courses',authenticateJwt, async(req, res) => {
  const course = new Course(req.body);
  await course.save();
  res.status(200).json({message : "Course added Successfully", course})
});

app.put('/admin/courses/:courseId',authenticateJwt, async(req, res) => {
  const update = await Course.findByIdAndUpdate(req.params.courseId,req.body,{new : true});
  if(update){
    res.json({message: "Updated successfully", update})
  }
  else{
    res.status(404).json({message: "Course not found!"})
  }
});

app.get('/admin/courses',authenticateJwt, async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

// User routes
app.post('/users/signup',async (req, res) => {
  const {username, password} = req.body;
  const user = await User.findOne({username : username})
  if(user){
    res.status(403).json({message : "User already exists"})
  }
  else{
    const newUser = new User({username : username, password : password});
    await newUser.save();
    const token = jwt.sign({username, role :"user"},SECRET,{expiresIn : '1h'});
    res.status(200).json({message:"User added successfully ", token});
  }

});

app.post('/users/login', async(req, res) => {
  const {username,password} = req.headers; 
  const user = await User.findOne({username:username , password:password});
  if(user){
    const token = jwt.sign({username, role:"user"},SECRET,{expiresIn:'1h'});
    res.status(200).json({message : "Login Successfull",token});
  }
  else{
    res.status(403).json({message : "Authentication failed"})
  }
 
});

app.get('/users/courses',authenticateJwt, async (req, res) => {
  const courses = await Course.find({published: true});
  res.json(courses);
});

app.post('/users/courses/:courseId',authenticateJwt, async (req, res) => {
  const course  = await Course.findById(req.params.courseId);
  if(course){
    const user = await User.findOne({username: req.headers.username});
    if(user){
      user.purchasedCourses.push(course);
      await user.save();
      res.json("Course Purchased Successfully!");
    }
    else{
      res.status(403).json({message : "User not found"});
    }
  }
  else{
    res.status(404).json({message : "Course not found"});
  }
});


app.get('/users/purchasedCourses',authenticateJwt, async(req, res) => {
  const user = await User.findOne({username : req.headers.username}).populate('purchasedCourses');
  if(user){
    res.json({purchasedCourses: user.purchasedCourses || []});
  }
  else{
    res.status(403).json({message : "User not found"});
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
