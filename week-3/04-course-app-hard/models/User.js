const mongoose = require("mongoose");
const Course = require("../models/Course");

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

module.exports = mongoose.model("User", userSchema);
