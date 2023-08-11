const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')
const app = express();

app.use(express.json());


// MONGOOSE Schemas
let userSchema = new mongoose.Schema({
  username : {type : String} ,
  password : { type : String} ,
  purchaseCourse : {type : mongoose.Schema.Types.ObjectId , ref : 'courses'}  
})

let adminSchema = new mongoose.Schema({
  username : {type : String} ,
  password : {type : String}
})

let coursesSchema = new mongoose.Schema({
  title : {type : String} ,
  description : {type : String} ,
  price : {type : Number} ,
  published : {type : Boolean}
})

// Definig Mongoose models 
let Users = new mongoose.model('Users' , userSchema);
let Admins = new mongoose.model('Admins' , adminSchema);
let Courses = new mongoose.model('Courses' , coursesSchema);
//Connecting to Server
mongoose.connect('mongodb+srv://vibgitcode27:Subzero@cluster0.eiyaeoh.mongodb.net/' , { useNewUrlParser: true, useUnifiedTopology: true, dbName: "Course" })

const salt = "S3r3Tyst";

// Token Generator
generateToken = (data) =>
{
  let payload = {username : data.username};
  let token = jwt.sign(payload , salt , {expiresIn : '1h'});
  return token;
}

// Authentication
AuthMiddleWare = (req ,res ,next) =>
{
  let token = req.headers.authorization;
  if(token)
  {
    const authtoken = token.split(" ")[1];
    jwt.verify(authtoken , salt , (err , data) =>
    {
      if(err) throw err;
      req.user = data;
      next();
    })
  }
  else{
    res.status(200).json({message : "Authorization failed"});
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const {username , password} = req.body;
  const check = await Admins.findOne({username});
  if(check)
  {
    res.status(403).json({message : "User already exist"});
  }
  else
  {
    let newAdmin = new Admins({username , password});
    await newAdmin.save();
    let token = generateToken(newAdmin);
    res.status(200).json({message : "Signed Up successfully" , token});
  }
});

app.post('/admin/login', async (req, res) => {
  let {username , password} = req.body;
  let check = await Admins.findOne({username , password});
  if(check)
  {
    token = generateToken(check);
    res.status(200).json({message : "Logged in successfully" , token})
  }
  else
  {
    res.status(403).json({message : "Autorization failed"})
  }
});

app.post('/admin/courses', AuthMiddleWare , async (req, res) => {
  // Description: Creates a new course.
  //  Input: Headers: { 'Authorization': 'Bearer jwt_token_here' }, Body: { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
  let course = req.body;
  let newCourse = new Courses(course);
  await newCourse.save();
  res.status(200).json({message : "Course created successfully" , newCourse})
});

app.put('/admin/courses/:courseId', AuthMiddleWare  , async (req, res) => {
  let upCourse = await Courses.findByIdAndUpdate(req.params.courseId , req.body , {new : true});
  if(upCourse)
  {
    res.status(200).json({message : 'Course updated successfully' , upCourse});
  }
  else
  {
    res.status(404).json({message : 'Request failed to execute'});
  }
});

app.get('/admin/courses', AuthMiddleWare , async (req, res) => {
  let found = await Courses.find();
  if(found)
  {
    res.status(200).json(found);
  }
  else res.status(404).json({message : 'No courses found'});
});

// User routes
app.post('/users/signup', async (req, res) => {
  let {username , password} = req.body;
  let check = await Users.findOne({username});
  if(check)
  {
    res.status(200).json({message : 'Username already exist'});
  }
  else
  {
    let newUser = new Users({username , password});
    await newUser.save();
    let token = generateToken(newUser);
    res.status(200).json({message : 'Signed Up successfully' , token});
  }
});

app.post('/users/login', async (req, res) => {
  const {username , password} = req.body;
  let check = await Users.findOne({username , password})
  if(check)
  {
    let token = generateToken(check)
    res.status(200).json({message : 'Logged in successfully' , token});
  }
  else
  {
    res.status(404).json({message : 'Login failed'});
  }
});

app.get('/users/courses', AuthMiddleWare , async (req, res) => {
    let found = await Courses.find({published : true});
    if(found)
    {
      res.status(200).json(found)
    }
    else res.status(404).json({message : 'Cannot find courses'})
});

app.post('/users/courses/:courseId', AuthMiddleWare , async (req, res) => {
  const course = await Courses.findById(req.params.courseId);
  console.log(course);
  if (course) {
    const user = await Users.findOne({ username: req.user.username });
    if (user) {
      user.purchasedCourses.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', AuthMiddleWare , async (req, res) => {
  const user = await Users.findOne({ username: req.user.username }).populate('purchasedCourses');
  if (user) {
    res.json({ purchasedCourses: user.purchasedCourses || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
