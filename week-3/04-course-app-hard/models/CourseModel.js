const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'must provide name'],
    maxlength: [20, 'name can not be more than 20 characters'],
  },
  description: {
    type: String,
    required: [true, 'must provide description'],
    maxlength: [200, 'Description can not be more that 200 characters'],
  },
  price: {
    type: Number,
    required: [true, 'must provide a price'],
  },
  imageLink: {
    type: String,
    required: [true, 'must provide a image link'],
  },
  published: {
    type: Boolean,
    default: false,
  }
})

module.exports = mongoose.model('Course', CourseSchema);