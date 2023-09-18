const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');

require('dotenv').config();


mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


app.use(express.json());

let AdminSchema = new mongoose.Schema({
  username: {
    type:String,
  },
  password: {
    type: Number
  }
});

let UsersSchema = new mongoose.Schema({
  username: {
    type:String,
  },
  password: {
    type: Number
  },
  coursesPurchased: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses'
  }]
});
let CoursesSchema = new mongoose.Schema({
  courseId: Number,
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});

const Admin = mongoose.model('Admin', AdminSchema);
const Users = mongoose.model('User', UsersSchema);
const Courses = mongoose.model('Courses', CoursesSchema);


const JWT_SECRET_KEY_ADMIN = process.env.JWT_SECRET_KEY_ADMIN;
const JWT_SECRET_KEY_USER = process.env.JWT_SECRET_KEY_USER;

const generateTokenForAdmin = (username) => {
  const data = { username };
  return jwt.sign(data, JWT_SECRET_KEY_ADMIN, {expiresIn: '1h'});

}

const generateTokenForUser = (username) => {
  const data = {username};
  return jwt.sign(data, JWT_SECRET_KEY_USER, {expiresIn: '1h'});
}


const authenticateJwtAdmin = (req,res,next) => {
  const accessToken = req.header("token");
  if(accessToken) {
    const token = accessToken.split(' ')[1];
    jwt.verify(token, JWT_SECRET_KEY_ADMIN, (err,user) => {
      if(err) {
        res.status(403).send("Got Authenticatoin Error");
      }
      next();
    })
  }
  else {
    res.status(401).send("Provide JWT token");
  }
}

const authenticateJwtUser = (req,res,next) => {
  const accessToken = req.header("token");
  if(accessToken) {
    const token = accessToken.split(' ')[1];
    jwt.verify(token, JWT_SECRET_KEY_USER, (err,user) => {
      if(err) {
        res.status(403).send("Got Authentication Error");
      }
      else {  
        req.user = user;
        console.log("here- " + user);
        next();
      }
    })
  }
  else {
    res.status(401).send("Provice JWT token");
  }
}

// Admin routes
app.post('/admin/signup', async (req, res) => {
  // logic to sign up admin
  const username = req.body.username;
  const pass = req.body.pass;
  const existingAdmin = await Admin.findOne({username, password:pass});
  console.log(existingAdmin);
  if(existingAdmin) {
    res.json({message: "User Already exist"});
  }
  else {
    const admin = new Admin({
      username: username,
      password: pass
    });
    const jwtToken = generateTokenForAdmin(username); 
    admin.save();
    res.json({message:"Admin Sign Up Successfully", jwtToken});
  }
});

app.post('/admin/login', async (req, res) => {
  // logic to log in admin
  const username = req.header("username");
  const pass = req.header("pass");
  const admin = await Admin.findOne({username, password:pass});
  if(admin) {
    const jwtToken = generateTokenForAdmin(username);
    res.json({ message: 'Logged in successfully', jwtToken });
  }
  else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.post('/admin/courses', authenticateJwtAdmin, (req, res) => {
  // logic to create a course
  const newCourse = req.body;
  //newCourse.id = Courses.length + 1;
  const course = new Courses(newCourse)
  course.save();
  res.json({ message: 'Course created successfully', courseId: course.id });
});

app.put('/admin/courses/:courseId', async (req, res) => {
  // logic to edit a course
  const course = await Courses.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  console.log(course);
  if (course) {
    res.json({ message: 'Course updated successfully' });
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/admin/courses', async (req, res) => {
  // logic to get all courses
  const courses = await Courses.find({});
  res.json({allCourses: courses})
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const username = req.body.username;
  const password = req.body.pass;
  const existingUser = await Users.findOne({username:username, password:password});
  if(existingUser) {
    res.json({message: 'User Already present'});
  }
  else {
    const user = new Users({
      username:username,
      password:password
    });
    const jwtToken = generateTokenForUser(username); 
    user.save();
    res.json({message:"User Signup Successfully", token: jwtToken});
  }
});

app.post('/users/login', async (req, res) => {
  // logic to log in user
  const username = req.header("username");
  const password = req.header("pass");
  const user = await Users.findOne({username, password});
  if(user) {
    const jwtToken = generateTokenForUser(username);
    res.json({message:"User Logged In successfully", token: jwtToken})
  }
  else {
    res.status(403).json({ message: 'Invalid username or password' });
  }
});

app.get('/users/courses', authenticateJwtUser, async (req, res) => {
  // logic to list all courses
  const courses = await Courses.find({published:true});
  res.json({courses});  
});

app.post('/users/courses/:courseId', authenticateJwtUser, async (req, res) => {
  // logic to purchase a course
  const courseId = req.params.courseId;
  const course = await Courses.findById(courseId);
  console.log(course);
  if(course) {
    console.log("yaha-"+req.user);
    const user = await Users.findOne({username: req.user.username});
    if(user) {
      user.coursesPurchased.push(course);
      await user.save();
      res.json({ message: 'Course purchased successfully' });
    }
    else {
      res.status(403).json({ message: 'User not found' });
    }
  }
  else {
    res.status(404).json({ message: 'Course not found' });
  }
});

app.get('/users/purchasedCourses', authenticateJwtUser, async (req, res) => {
  // logic to view purchased courses
  const user = await Users.findOne({ username: req.user.username }).populate('coursesPurchased');
  if (user) {
    res.json({ coursesPurchased: user.coursesPurchased || [] });
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
