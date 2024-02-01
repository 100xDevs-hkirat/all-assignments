const mongoose = require("mongoose");

const USERS_Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    purchasedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "COURSES",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const USERS = mongoose.model("USERS", USERS_Schema);
module.exports = USERS;
