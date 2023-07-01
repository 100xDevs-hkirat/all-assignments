const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  purchasedCourses: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});

const AdminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const CourseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean,
});

const UserModel = mongoose.model("User", UserSchema);
const AdminModel = mongoose.model("Admin", AdminSchema);
const CourseModel = mongoose.model("Course", CourseSchema);

module.exports = { UserModel, AdminModel, CourseModel };
