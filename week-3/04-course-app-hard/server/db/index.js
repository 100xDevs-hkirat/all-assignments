const mongoose = require('mongoose');

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

  module.exports = {
    Admin,
    Users,
    Courses
  }