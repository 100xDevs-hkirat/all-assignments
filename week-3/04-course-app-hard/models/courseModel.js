const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A course must have a title'],
    default: '',
    trim: true,
  },
  description: { type: String, default: '' },
  price: {
    type: Number,
    default: 0,
  },
  imageLink: { type: String, default: '' },
  published: { type: Boolean, default: true },
})

const Course = mongoose.model('Course', courseSchema)
module.exports = Course
