const express = require("express");
const mongoose = require("mongoose");
const app = express();
const todoRouter = require("./routes/todo");
const authRouter = require("./routes/auth");
app.use(express.json());
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "todos",
});

app.use("/todo", todoRouter);
app.use("/auth", authRouter);

app.listen(3000);
