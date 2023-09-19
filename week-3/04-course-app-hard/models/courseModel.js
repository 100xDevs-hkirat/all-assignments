const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number
    },
    imageLink: {
        type: String
    },
    published: Boolean
  });

  const Course = mongoose.model('Course', courseSchema);