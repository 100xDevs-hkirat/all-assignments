import express from "express";
import mongoose from "mongoose";
const port = 3000;
import authRoute from "./routes/auth";
import todoRoute from "./routes/todo";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/auth",authRoute);
app.use("/todo",todoRoute);

mongoose.connect("mongodb://127.0.0.1:27017/todo`",{dbName:"todo"});

app.listen(port,()=>{
    console.log(`Example app is listening at ${port}.`);
})

