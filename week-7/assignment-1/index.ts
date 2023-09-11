
import express from 'express';
const app = express();
import mongoose from 'mongoose';
const port = 3000;
import authRoutes from './routes/auth';
import todoRoutes from './routes/todo';

const cors = require("cors");
const {DB_USERNAME,DB_PASSWORD} = require('./db/db-config')

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/todo", todoRoutes);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

mongoose.connect(`mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.jdsajjq.mongodb.net/todos`);