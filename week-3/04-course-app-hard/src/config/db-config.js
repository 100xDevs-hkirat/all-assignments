import mongoose from "mongoose";
import { DB_URL } from "./config";

const connect = () => {
  mongoose.connect(DB_URL);
};

module.exports = connect;
