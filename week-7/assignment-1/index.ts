import express from "express";
const app = express();
import mongoose from "mongoose";
const port = 3000;
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
const cors = require("cors");

mongoose.connect('mongodb+srv://akshit:Akki-123@cluster0.jmjzcjf.mongodb.net/Courses', {dbName: "Courses" });
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
