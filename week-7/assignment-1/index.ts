// const express = require("express");

// const mongoose = require("mongoose");
// const authRoutes = require("./routes/auth");
// const todoRoutes = require("./routes/todo");
// const cors = require("cors");

import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import cors from "cors";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(
  "mongodb+srv://amanrawat9690:1OrKGoXfozOszSHz@cluster0.grdmre6.mongodb.net/todoApp"
);
