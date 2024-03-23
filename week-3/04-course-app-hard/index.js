const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const mongoose= require('mongoose');
app.use(express.json());


//Creating Schemas for the collections of the database
const userSchema = new mongoose.Schema({
  username: {type: String},
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

const User= mongoose.model('User',userSchema);
const Admin= mongoose.model('Admin',adminSchema);
const Course= mongoose.model('Course',courseSchema);


//Connecting Database
mongoose.connect('mongodb://localhost:27017/',{dbName: "CourseSellingApp"})
  .then(()=>{
    console.log("MongoDB now connected");
  })
  .catch((err)=>{
    console.log("Error while connecting with database");
});


const secretKey="secretSauceOfAGoodAuth";

//function to create a jwt signed token
const jwtToken=(user)=>{
  const tokenData= {username:user.username};
  return jwt.sign(tokenData,secretKey,{ expiresIn:'1h' });
}

//function to authenticate jwt signed token
const jwtAuthentication = (req,res,next)=>{
  const authHead=req.headers.Authorization;
  if(authHead)
  {
    const authtoken=authHead.split(' ')[1];

    jwt.verify(authtoken,secretKey,(err,data)=>{
      if(err)
      {
        res.sendStatus(403);
      }
        req.user=data;
        next();
    });
  }
  else res.status(401);
}


// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const {username,password}=req.body;
  const existing= await Admin.findOne({username});

  if(existing)res.status(403).json({message: "Admin already Exist"});
  
  else
  {
    const newAdmin = new Admin({username:username,password:password})
    await newAdmin.save();
    const token=jwtToken(newAdmin);
    res.json({message: "Admin Created Successfully", token});
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const {username,password}=req.headers;
  const admin = await Admin.findOne({username:username,password:password});

  if (admin) {
    const token = jwtToken(admin);
    res.json({ message: 'Logged in successfully', token });
  } else {
    res.status(403).json({ message: 'Admin authentication failed' });
  }
});

app.post('/admin/courses', jwtAuthentication, async (req, res) => {
  // logic to create a course
  const course=req.body;
  course.id=Date.now();

  const newCourse= new Course(course);
  await newCourse.save();
  res.json({message:"Course created successfully", courseId:course.id});
});

app.put('/admin/courses/:courseId', jwtAuthentication, async (req, res) => {
  // logic to edit a course
  const courseId= parseInt(req.params.courseId);
  const editing=req.body;
  const course= await Course.findOneAndUpdate(courseId,editing,{new:true});
  
  if(course){
    res.json({message:"Course Updated Successfully"})
  } 
  else{
    res.status(404).json({message:"Course not found"});
  }
});

app.get('/admin/courses',jwtAuthentication, async (req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({courses: courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const {username,password}=req.body;
  const existing= await User.findOne({username});

  if(existing)res.status(403).json({message: "User already Exist"});
  
  else
  {
    const newUser= new User({username: username,password: password})
    await newUser.save();
    const token= jwtToken(newUser);
    res.json({message: "User Created Successfully",token});
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const {username,password}=req.headers;
  const user= await User.findOne({username:username, password:password});

  if(user)
  {
    const token=jwtToken(user);
    res.json({message: "User login successful",token});
  }
  else
  {
    res.status(403).json({ message: 'User authentication failed' });
  }

});

app.get('/users/courses',jwtAuthentication, async(req, res) => {
  // logic to list all courses
  const filteredCourses= await Course.find({published:true});
  res.json({ courses: filteredCourses });
});

app.post('/users/courses/:courseId', jwtAuthentication, async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = await Course.findById(courseId);
  if (course) {
    const user = await User.findOne({username : req.user.username});
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message:'Course purchased successfully'});
    } else {
      res.status(403).json({ message:'User not found'});
    }
  } else {
    res.status(404).json({ message:'Course not found'});
  }
});

app.get('/users/purchasedCourses', jwtAuthentication, (req, res) => {
  const user = User.findOne({username: req.user.username});
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(404).json({ message: 'No courses purchased' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
