const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageLink: {
      type: String,
      default: "https://linktoimage.com",
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        let id = ret._id;
        delete ret._id;
        ret.id = id;
      },
    },
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
