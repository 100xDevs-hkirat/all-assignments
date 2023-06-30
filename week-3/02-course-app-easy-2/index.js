const express = require('express');
const mongoose = require('mongoose');
const {config} = require('dotenv');
const { adminSignup, adminLogin } = require('./controllers/admin.controller');
const isAdmin = require('./middlewares/isAdmin');
const { createCourse, editCourse, getCourses } = require('./controllers/course.controller');
const { userSignup, userLogin, purchaseCourse, getPurchasedCourses } = require('./controllers/user.controller');
const isUser = require('./middlewares/isUser');
const app = express();

app.use(express.json());
config();

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1/course-app-easy')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));

// Admin routes
app.post('/admin/signup', adminSignup);

app.post('/admin/login', adminLogin);

app.post('/admin/courses', isAdmin, createCourse);

app.put('/admin/courses/:courseId', isAdmin, editCourse);

app.get('/admin/courses', isAdmin, getCourses);

// User routes
app.post('/users/signup', userSignup);

app.post('/users/login', userLogin);

app.get('/users/courses', isUser, getCourses);

app.post('/users/courses/:courseId', isUser, purchaseCourse);

app.get('/users/purchasedCourses', isUser, getPurchasedCourses);

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
