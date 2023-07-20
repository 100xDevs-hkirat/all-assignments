const mongoose = require("mongoose");

const COURSES_SCHEMA = new mongoose.Schema(
  {
    title: {
      type: String,
      unique: true,
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
      required: true,
    },
    published: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const COURSES = mongoose.model("COURSES", COURSES_SCHEMA);

module.exports = COURSES;
