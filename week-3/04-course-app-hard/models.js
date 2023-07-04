const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  courses: {
    type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Course' }],
    validate: {
      validator: validatePurchasedCourses,
      message: 'Course already purchased',
    },
  },
});

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  published: { type: Boolean, required: true },
  imageLink: { type: String, required: true },
});

async function validatePurchasedCourses(courses) {
    const uniqueCourseIds = new Set();
  
    for (const course of courses){
      const courseId = course._id.toString()
      console.log(courseId)
      if(uniqueCourseIds.has(courseId)){
        return false
      } 
      uniqueCourseIds.add(courseId)
    }
    return true
  }

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
module.exports = { User, Admin, Course}