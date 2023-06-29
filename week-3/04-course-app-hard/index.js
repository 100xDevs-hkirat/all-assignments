const app = require("./app");
const mongoose = require("mongoose");
const CustomError = require("./errors/custom-error");
require("dotenv").config();

const start = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/courses`);
  } catch (err) {
    console.log(err);
    throw new CustomError(err.message);
  }

  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
  });
};

start();
