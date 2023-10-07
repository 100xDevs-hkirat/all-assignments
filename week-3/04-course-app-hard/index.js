const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

const SECRET = 'MyLittleSecret';

// Mongo Schemas 
const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // this will allow purchasedCourses to enter the user's model 
  // only if the course id of the purchasedCourses are present in the Course Modal
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
})

const courseSchema = new mongoose.Schema({
  title: String, 
  description: String, 
  price: Number, 
  imageLink: String,
  published: Boolean
})

// Mongoose Models
const Admin = mongoose.model('Admin', adminSchema); 
const User = mongoose.model('User', userSchema); 
const Course = mongoose.model('Course', courseSchema); 

const authenticateJwt = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, decrypted) => {
      if (err) {
        return res.sendStatus(203);
      }
      req.user = decrypted;
        // res.json({ message : "Decrypted Succesfully !! : ", decrypted });
        next();
    })
  } else {
    res.sendStatus(401);
  }
}

const generateJwt = (jwtObj) => {
  const token = jwt.sign(jwtObj, SECRET, { expiresIn: '1h' });
  return token;
}

// Connecting Backend to the Database 
mongoose.connect('mongodb+srv://saad76:EKrYWkWPUSQHTLLn@cluster0.wgmqb0q.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });

// Admin routes
app.post('/admin/signup', async (req, res) => {
  const { username, password } = req.body;
  const admin = await Admin.findOne({ username });
  if (admin) {
    res.status(403).json({ message: 'Admin Already Exists !' });
  } else {
    const newAdmin = new Admin({ username, password });
    newAdmin.save(); // .save() method saves the newly created admin in the mongoose database
    const jwtObj = { username, role: 'ADMIN' };
    let token = generateJwt(jwtObj);
    res.json({ message : 'admin created succesfully !', token})
  }
});

app.post('/admin/login', async(req, res) => {
  // logic to log in admin
  const { username, password } = req.headers;
  const admin = await Admin.findOne({ username, password });
  if (!admin) {
    res.status(403).json({ message: "Invalid Username/Password" });
  } else {
    const jwtObj = { username, role: "ADMIN" };
    const token = generateJwt(jwtObj);
    res.json({message : 'Logged In Succesfully !', token})
  }
});

app.post('/admin/courses', authenticateJwt, async(req, res) => {
  // logic to create a course
  const course = new Course(req.body);
  await course.save();
  res.json({ message: "Course Created Succesfully !", courseId: course.id });
});

app.put('/admin/courses/:courseId', authenticateJwt, async(req, res) => {
  // logic to edit a course
  const courseFound = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if (courseFound) {
    res.json({ message: 'Course Updated Succesfully !' });
  } else {
    res.status(404).json({ message: 'Course Not Found !' });
  }
});

app.get('/admin/courses', async(req, res) => {
  // logic to get all courses
  const courses = await Course.find({});
  res.json({courses});
});

// User routes
app.post('/users/signup', async (req, res) => {
  // logic to sign up user
  const { username, password } = req.body;
  const user = await User.findOne({username});

  if (user) {
    res.status(403).json({ message: 'User already exists' });
  } else {
    const newUser = new User({ username, password });
    await newUser.save();
    generateJwt({username, role: "USER"})
    const token = generateJwt({username, role: "USER"})
    res.json({ message: 'User Registered Succesfully', token });
  }
});

app.post('/users/login', async(req, res) => {
  // logic to log in user
  const { username, password } = req.headers;
  const user = await User.findOne({ username, password });
  if (!user) {
    res.status(403).json({ message: 'Invalid Username or Password' });
  } else {
    const token = generateJwt({ username, role: "USER" });
    // req.user = username;
    res.json({ message: "User Logged In Succesfully !", token });
  }
});

app.get('/users/courses', authenticateJwt, async(req, res) => {
  // logic to list all courses\
  const courses = await Course.find({});
  res.json({ courses });
});

app.post('/users/courses/:courseId', authenticateJwt, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (course) {
    const user = await User.findOne({ username: req.user.username });
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

app.get('/users/purchasedCourses', authenticateJwt, async(req, res) => {
  // logic to view purchased courses
  const user = await User.findOne({ username: req.user.username });
  if (user) {
    res.json({ purchasedCourses : user.purchasedCourses || []});
  } else {
    res.status(403).json({ message: 'User not found' });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
