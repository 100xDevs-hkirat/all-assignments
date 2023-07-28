import express from 'express';
const app = express()
import mongoose from "mongoose";
const port = 3000;
const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todo')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use('/auth', authRoutes)
app.use('/todo', todoRoutes)

app.listen(port, ()=> { 
    console.log('listening on port ' + port)
})

mongoose.connect('mongodb://127.0.0.1:27017/courses' )