const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.password;
      },
    },
  }
);

adminSchema.pre("save", async function () {
  try {
    let hashedPassword = await bcrypt.hash(this.password, 8);
    this.password = hashedPassword;
    console.log(this.password);
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
