
import express from "express";
const app = express();
import mongoose from "mongoose";
const port = 3000;
import {router} from "./routes/auth";
import {todoRouter} from "./routes/todo";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use("/auth", router);
app.use("/todo", todoRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect('mongodb://localhost:27017/courses', { dbName: "courses" });
