
import express, { Express } from "express";
import mongoose from "mongoose";
import config from "./config";
import authRoutes from "./routes/auth";
import todoRoutes from "./routes/todo";
import cors from "cors";

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(config.PORT, () => {
    console.log(`Example app listening at http://localhost:${config.PORT}`)
})

mongoose.connect(config.MONGO_URI, { dbName: "courses" });
