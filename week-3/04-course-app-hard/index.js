const express = require('express');
const app = express();
const fs = require('fs');
const jwt = require("jsonwebtoken");
const  mongoose  = require('mongoose');
const  {MongoDB}  = require('mongodb');

const uri = 'mongodb+srv://tejasg4646:tejas12345@cluster0.qqxhzf4.mongodb.net/';

app.use(express.json());
mongoose.connect(uri);
// Call the connectToDB function to establish the connection
// connectToDB();

const userSchema = new mongoose.Schema({
  username : String,
  password : String,
  purchasedCourse : [{ type : mongoose.Schema.Types.ObjectId, ref : 'Course' }],
})

const adminSchema = new mongoose.Schema({
  username : String,
  password : String,
})

const courseSchema = new mongoose.Schema({
  title : String,
  price : Number,
  description : String,
  imageLink : String,
  published : Boolean,
})

const secretKey = "s3cr3yK3y"

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);

function authenticateJwt(req, res, next) {
  const authHeader = req.headers.authorization;
  if(authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secretKey, (err, user) => {
      if(err) throw err;
      req.user = user;
      next();
    })
  }else{
    res.status(401).send("User Authorization Failed");
  }
}
// const client =  MongoDB(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// async function connectToDB() {
//   try {
//     await client.connect();
//     console.log('Connected to MongoDB!');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// }

app.get("/", (req, res) => {
  res.send("Welcome To Course Selling website");
})

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const {username, password} = req.body;
  const admin = await Admin.findOne({ username });
  if(admin){
    res.status(403).send("Admin already exist");
  }else{
    var adminObj = {"username" : username, "password": password};
    const newAdmin = new Admin(adminObj);
    await newAdmin.save();
    const token = jwt.sign({ username, role: 'admin' }, secretKey, { expiresIn: '1h' });
    res.status(200).json({"msg":"Admin Created successfully",token });
  }
});

app.post('/admin/login', async (req, res) => {
  const {username, password} = req.body;
  const admin = await Admin.findOne({username, password});
  if(admin){
    const token = jwt.sign({username, role : 'admin'}, secretKey, {expiresIn : '1h'});
    res.status(200).json({"msg":"Admin Logged in successful", token});
  }else{
    res.send("Admin Not found "+ admin);
  }
});

app.post('/admin/courses', authenticateJwt,async (req, res) => {
  try{
    const {title, description, price, imageLink, published} = req.body;
    const courseObj ={"title" : title, "description":description, "price": price, "imageLink": imageLink, "published": published};
    const course = new Course(courseObj);
    await course.save();
    res.status(200).json({"msg" : "Course Created Successfully", courseObj});
  } catch(err) {
    res.status(403).send(err);
  }
});

app.put('/admin/courses/:courseId', async (req, res) => {
  try{
    const cId = req.params.courseId;
    const updatedCourseDetails = await Course.findByIdAndUpdate(cId, ({
      title : req.body.title,
      price : req.body.price,
      description: req.body.description,
      imageLink : req.body.imageLink, 
      published : req.body.published,
    }), { new: true })
  
    res.status(200).json({
      "msg" : "Course Updated successfully",
      updatedCourseDetails
    })
  }catch(err) {
    res.status(404).send(err);
  }
});

app.get('/admin/courses',async  (req, res) => {
try{
  const allCourses = await Course.find({});
  res.status(200).send(allCourses);
}catch(err){
  res.status(403).send(err);
}

});

// User routes
app.post('/users/signup',async (req, res) => {
try {
  const {username, password} = req.body;
  const userObj = {
    "username": username,
    "password" : password
  }
  const userExist = await  User.findOne({ username });
  if(userExist){
    res.status(403).send({"msg" : "User Already Exist"});
  }else{
    const user = new User(userObj);
    const signedUpUser = await user.save();
    const token = jwt.sign({username, password, role : "user"}, secretKey,{expiresIn : '1h'})
    res.status(200).json({
      "msg" : "User Created Successfully",
      signedUpUser,
      token
    });
  }
} catch(err) {
  res.status(403).send(err);
}
});

app.post('/users/login',  async (req, res) => {
  try{
    const {username, password} = req.body;
    const user = await  User.findOne({username, password});
    console.log("user  ->>  "+ user);
    const token = jwt.sign({ username, role: 'user' }, secretKey, { expiresIn: '1h' });
    console.log("token  ->>  "+ token);
    res.status(200).json({"msg" : 'Login successful', user, token});
  }catch(err){
    res.status(200).json({"msg" : 'Login UnSuccessful', err});
  }
});

app.get('/users/courses', authenticateJwt, async (req, res) => {
  try{
    const allCourses = await Course.find({});
    const allPublishedCourses = allCourses.filter(c => c.published === true);
    res.status(200).send(allPublishedCourses);
  }catch(err) {
    res.status(403).json({"msg" : err});
  }
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {

  const cId = req.params.courseId;
  const course = await Course.findById(cId);
  const username = req.user.username;
  if(course){
    var userDetails = await User.findOne({ username });
    if(userDetails){
      userDetails.purchasedCourse.push(course);
      await userDetails.save();
      res.status(200).json({"msg":"Course Purchased Successfully"});
    }else{
      res.status(403).json({"msg" : "User Not found"});
    }
  }else{
    res.status(403).json({
      "msg":"Course Not Found"
    })
  }
});

app.get('/users/purchasedCourses',  authenticateJwt, async (req, res) => {
  try{
    const user = await User.findOne({ username : req.user.username}).populate('purchasedCourse'); 
    if(user){
      res.status(200).json({purchasedCourse : user.purchasedCourse || [] });
    }else{
      res.status(403).json({ "msg" : "User not found"});
    }
  }catch(err){
    res.status(403).send(err);
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
