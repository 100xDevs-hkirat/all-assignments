const mongoose = require("mongoose");

const ADMINSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
  },
  {
    timestamps: true,
  }
);

const ADMINS = mongoose.model("ADMINS", ADMINSchema);

module.exports = ADMINS;
