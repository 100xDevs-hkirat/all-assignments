const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

/* hash user password */
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* match user entered password with encrypted db stored password */
AdminSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
