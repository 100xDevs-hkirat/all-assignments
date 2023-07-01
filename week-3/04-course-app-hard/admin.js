const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "Admin",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Amidn", adminSchema);

module.exports = Admin;
