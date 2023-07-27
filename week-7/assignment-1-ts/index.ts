import express from "express"
// const express = require("express");
import mongoose from "mongoose";
const app = express();
import {todoRouter} from "./routes/todo";
import {authRouter} from "./routes/auth";
app.use(express.json());
mongoose.connect("mongodb://localhost:27017", {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  dbName: "todos",
});

app.use("/todo", todoRouter);
app.use("/auth", authRouter);

app.listen(3000);
