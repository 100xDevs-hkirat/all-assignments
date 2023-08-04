import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ADMIN_SALT } from "../config/config.js";

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      default: "",
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
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

adminSchema.pre("save", () => {
  this.username = `${this.firstname} ${this.lastname}`;
});

adminSchema.pre("save", () => {
  let hashPassword = bcrypt.hashSync(this.password, ADMIN_SALT);
  this.password = hashPassword;
});

const Admin = mongoose.model("Amidn", adminSchema);

module.exports = Admin;
