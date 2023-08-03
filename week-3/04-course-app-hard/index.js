const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// let ADMINS = [];
// let USERS = [];
// let COURSES = [];

const jwtSecretKey = String(Math.floor(Math.random() * 10000000));

const userSchema = new mongoose.Schema({
  username : {type: String},
  password : String,
  purchasedCourse : [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}]
});

const adminSchema = new mongoose.Schema({
  username : String,
  password : String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
  id: Number
});

// mongoose models 
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

function adminAuthentication(req, res, next){
  let username = req.headers.username;
  let password = req.headers.password;

  let found = ADMINS.find((ele)=>{
    return (ele["username"]===username && ele["password"]===password)
  })

  if(found){
    next();
  } else{
    res.status(401).json({ "message": 'Wrong username or password!' })
  }
}

function tokenAuthentication(req, res, next){
  let token = req.headers.authorization;
  if (token){
    token = token.replace("Bearer ", "");
    jwt.verify(token, jwtSecretKey, (err, user)=>{
      if (err) {
        res.status(403).json({ "message": 'You have been logged-out! Please login again.' })
      }else{
        req.user = user;
        // console.log("req.user : ", req.user);
        next();
      }
  })} else{
    res.status(401).json({ "message": 'You have been logged-out! Please login again.' })
  }
}

function userAuthentication(req, res, next){
  username = req.headers.username;
  password = req.headers.password;

  let found = USERS.find((ele)=>{
    return (ele["username"]===username && ele["password"]===password)
  })

  if(found){
    next();
  } else{
    res.status(401).json({ "message": 'Wrong username or password!' })
  }
}

// Connect to MongoDB
mongoose.connect("mongodb+srv://skhureshi07:PhzfWrPPeGDdLKdq@cluster0.pqhj8hj.mongodb.net/", {useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

// Admin routes
app.post('/admin/signup', async(req, res) => {
  // logic to sign up admin
  let adminDetails = {
    username : req.body.username,
    password : req.body.password,
    role: "admin"
  }

  const admin = await Admin.findOne({username : req.body.username});
  if (admin){
    res.status(403).json({ message: 'Admin already exists' });
  } else{
    const newAdmin = new Admin(adminDetails)
    newAdmin.save();
    const token = jwt.sign(adminDetails, jwtSecretKey, { expiresIn: '1h' });
    res.json({ 
      message: 'Admin created successfully', 
      token: token
    });
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  let adminDetails = {
    username : req.headers.username,
    password : req.headers.password,
    role: "admin"
  }

  const admin = await Admin.findOne({username : req.headers.username});
  if (admin){
    const token = jwt.sign(adminDetails, jwtSecretKey, { expiresIn: '1h' });
    res.json({ 
      message: 'Admin loggedin successfully', 
      token: token
    });
  } else{
    res.status(403).json({ message: 'Admin does not exists! Please SignUp.' });
  }
});

app.post('/admin/courses', tokenAuthentication, async (req, res) => {
  // logic to create a course
  let newCourse = {
    title : req.body.title,
    description : req.body.description,
    price : req.body.price,
    imageLink : req.body.imageLink,
    published : req.body.published
  }

  const courseObj = new Course(newCourse);
  await courseObj.save();

  // console.log("courseObj: ", courseObj);
  res.json({ "message": 'Course created successfully', "courseId": courseObj._id})
});

app.put('/admin/courses/:courseId', tokenAuthentication, async(req, res) => {
  // logic to edit a course

  let idNo = req.params.courseId;
  let course = await Course.findByIdAndUpdate(idNo, req.body, { new : true });
  if (course){
    res.json({ message: 'Course updated successfully' });
  } else{
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', tokenAuthentication, async(req, res) => {
  // logic to get all courses
  let course = await Course.find({});
  res.json(course);
});

// User routes
app.post('/users/signup', async(req, res) => {
  // logic to sign up user
  const {username, password} = req.body;
  const user = await User.findOne({username});
  if (user){
    res.status(403).json({ message: 'User already exists' });
  } else{
    const newUser = {username, password};
    const userObj = new User(newUser);
    await userObj.save();
    const token = jwt.sign({newUser, role:"user"}, jwtSecretKey, {expiresIn:'1h'});
    res.json({"message":"User has been created", token});
  }
});

app.post('/users/login', async(req, res) => {
  // logic to log in user
  let userDetails = {
    username : req.headers.username,
    password : req.headers.password,
    role: "user"
  }
  const userObj = await User.findOne({username : req.headers.username});

  if (userObj){
    const token = jwt.sign({userDetails}, jwtSecretKey, {expiresIn:'1h'});
    res.json({message: 'User loggedin successfully', token});
  } else{
    res.status(403).json({ message: 'User does not exists! Please SignUp.' });
  }
});

app.get('/users/courses', tokenAuthentication, async(req, res) => {
  // logic to list all courses
  const courseDetails = await Course.find({published: true});
  res.json(courseDetails);
});

app.post('/users/courses/:courseId', tokenAuthentication, async(req, res) => {
  // logic to purchase a course
  // console.log("req.user: ", req.user);
  // console.log("req.user.username: ", req.user.userDetails.username);

  const idNo = req.params.courseId;
  const courseDetails = await Course.findById(idNo);
  // console.log("courseDetails: ", courseDetails);
  if (courseDetails){
    const userDetails = await User.findOne({"username":req.user.userDetails.username});
    // console.log("userDetails: ", userDetails);
    if (userDetails){
      userDetails.purchasedCourse.push(courseDetails);
      await userDetails.save();
      res.json({ message: 'Course purchased successfully' })
    }else{
      res.status(403).json({ message: 'User not found' })
    }
  } else {
      res.status(404).json({ message: 'Course not found' })
    }

});

app.get('/users/purchasedCourses', tokenAuthentication, async(req, res) => {
  // logic to view purchased courses
  const userDetails = await User.findOne({"username":req.user.userDetails.username}).populate('purchasedCourse');
  if (userDetails){
    res.json(userDetails.purchasedCourse);
  }else{
    res.status(404).json({message: "User not found"});
  }
});

app.use((req, res)=>{
  res.status(404).send("Route Not found!");
})

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
