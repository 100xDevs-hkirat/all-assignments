const express = require("express");
const cors = require("cors");
const adminRouter = require("./routes/admin");
const userRouter = require("./routes/user");
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json())

app.use("/admin", adminRouter);
app.use("/user", userRouter);

// Connecting Backend to the Database
mongoose.connect(
  "mongodb+srv://saad76:EKrYWkWPUSQHTLLn@cluster0.wgmqb0q.mongodb.net/",
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" }
);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
