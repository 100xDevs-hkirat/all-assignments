const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path: "./local.env"});

const app = require('./app');

const DATABASE = process.env.DATABASE_URL.replace(
  "<password>",
  process.env.DATBASE_PASSWORD
);

mongoose
  .connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connection is successfull "))
  .catch((err) => console.log(err));


  app.listen(3001,() => {
    console.log("App is running on 3001");
    
})