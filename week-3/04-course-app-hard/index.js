const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const short = require('short-uuid');
app.use(express.json());
const SECRET_KEY = 'hullapaluza';

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});
const Admin = mongoose.model('admin', adminSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }]
});
const User = mongoose.model('user', userSchema);


const courses = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});
const Courses = mongoose.model('course', courses);

mongoose.connect('mongodb://localhost/coursesdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });


function generateToken(user) {
  const token = jwt.sign(user, SECRET_KEY, { expiresIn: '1h' });
  return token;
}

function validateToken(req, res, next) {
  const token = req.headers.authorization.substring(7);
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    req.user = decoded || null;
    next();
  });
}

function validateUsername(username) {
  if (username && typeof username === 'string') return;
  throw new Error("Invalid Username");
}

function validatePassword(password) {
  if (password && typeof password === 'string') return;
  throw new Error("Invalid password");
}

// { title: 'course title', description: 'course description', price: 100, imageLink: 'https://linktoimage.com', published: true }
function validateCourse(body) {
  if (!body.title || typeof body.title !== 'string')
    throw new Error("Invalid title");
  if (!body.description || typeof body.description !== 'string')
    throw new Error("Invalid description");
  if (!body.price || typeof body.price !== 'number')
    throw new Error("Invalid price");
  if (!body.imageLink || typeof body.imageLink !== 'string')
    throw new Error("Invalid imageLink");
  if (!body.published || typeof body.published !== 'boolean')
    throw new Error("Invalid published");
}
// Admin routes
app.post('/admin/signup', async (req, res) => {
  const userName = req.body.username || null;
  const password = req.body.password || null;
  try {
    validateUsername(userName);
    validatePassword(password);
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const user = { username: userName, password: password };
  const dbUser = await Admin.create(user);
  const token = generateToken(user);
  return res.status(200).json({ message: 'Admin created successfully', token: token });
});

app.post('/admin/login', async (req, res) => {
  try {
    const admin = await Admin.findOne({ username: req.headers.username });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
    const user = { username: admin.username, password: admin.password };
    const token = generateToken(user);
    return res.status(200).json({ message: 'Logged in successfully', token: token });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.post('/admin/courses', validateToken, async (req, res) => {
  try {
    validateCourse(req.body);
    const currentCourse = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      imageLink: req.body.imageLink,
      published: req.body.published
    }
    let course = await Courses.create(currentCourse);
    return res.status(200).json({ message: 'Course created successfully', courseId: course.id })
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.put('/admin/courses/:courseId', validateToken, async (req, res) => {
  try { 
    const courseId = req.params.courseId;
    validateCourse(req.body);
    const updatedCourse = await Courses.findByIdAndUpdate(courseId, req.body, { new: true });
    if (!updatedCourse) return res.status(404).json({ message: 'Course not found' });
    return res.status(200).json({ message: 'Course updated successfully' });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get('/admin/courses', validateToken, async (req, res) => {
  try {
    let courses = await Courses.find({});
    courses = courses.map(course => {
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        imageLink: course.imageLink,
        published: course.published
      }
    })
    return res.status(200).json({ courses: courses });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
  // logic to get all courses
});

// User routes
app.post('/users/signup', async (req, res) => {
  const userName = req.body.username || null;
  const password = req.body.password || null;
  try {
    validateUsername(userName);
    validatePassword(password);
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
  const user = { username: userName, password: password };
  const savedUser = await User.create(user);
  const token = generateToken(user);
  return res.status(200).json({ message: 'User created successfully', token: token });
});

app.post('/users/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.headers.username , password: req.headers.password});
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const token = generateToken({username : user.username, password : user.password});
    return res.status(200).json({ message: 'Logged in successfully', token: token });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get('/users/courses', validateToken, async (req, res) => {
  try {
    let courses = await Courses.find({});
    courses = courses.map(course => {
      return {
        id: course._id,
        title: course.title,
        description: course.description,
        price: course.price,
        imageLink: course.imageLink,
        published: course.published
      }
    })
    return res.status(200).json({ courses: courses });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
  // logic to list all courses
});

app.post('/users/courses/:courseId', validateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const courseId = req.params.courseId;
    const user = await User.findOne({username : username});
    user.purchasedCourses.push(courseId);
    await user.save();
    return res.status(200).json({ message: 'Course purchased successfully' });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.get('/users/purchasedCourses', validateToken, async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username}).populate('purchasedCourses');
    return res.status(200).json({ purchasedCourses: user.purchasedCourses });
  }
  catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});