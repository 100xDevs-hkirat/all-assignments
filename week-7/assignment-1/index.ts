
import express from 'express';
import mongoose from 'mongoose';
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
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('mongodb+srv://riajain:JaneEyre12345@cluster0.dyaxijp.mongodb.net/localhost:27017/courses', { dbName: "courses" });
