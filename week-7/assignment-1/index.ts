import express from "express";
import mongoose from "mongoose";
import todoRoutes from "./routes/todo";
import authRoutes from "./routes/auth";
import cors from "cors";
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect("mongodb://localhost:27017/courses", { dbName: "courses" });
