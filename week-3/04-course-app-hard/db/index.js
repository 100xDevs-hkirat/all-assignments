const mongoose = require('mongoose')

//Step2:- Define the schemas
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourse: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
})

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
})

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
})

//Step3:- Define the models
const User = mongoose.model('User', userSchema)
const Admin = mongoose.model('Admin', adminSchema)
const Course = mongoose.model('Course', courseSchema)

module.exports = {
  User,
  Admin,
  Course,
}
