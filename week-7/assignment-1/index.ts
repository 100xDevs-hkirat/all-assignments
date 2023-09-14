import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import authRoute from './routes/auth';
import todoRoute from './routes/todo';

const PORT = 3000;


const app = express();

app.use(cors());
app.use(express.json())
app.use("/auth", authRoute);
app.use("/todo", todoRoute);



app.listen(PORT, () => {
    console.log("Server is listening on port", PORT);
})

mongoose.connect('mongodb://127.0.0.1:27017/courses');
