const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema({
  title:{
    type: String,
    required : true
  },
  description:{
    type: String,
    required : true
  },
  price:{
    type: Number,
    required : true
  },
  imgLink:{
    type: String,
    required : true
  },
  published:{
    type: Boolean,
    default: true,
  },
  userID:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'admin'
  },
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('course',CourseSchema)