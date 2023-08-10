import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect("mongodb://127.0.0.1:27017/courses", { dbName: "courses" });
