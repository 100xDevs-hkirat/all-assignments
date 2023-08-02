const express = require('express')
const app = express()
const cors = require('cors')
const adminRouter=require('./routes/admin')
const userRouter=require('./routes/user')

//Step1:- use the mongoose library
const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())

app.use('/admin', adminRouter)
app.use('/users', userRouter)


//Step4:- Connect with the mongodb database using the connection string
mongoose.connect(
  'mongodb+srv://tina:9123053629@cluster0.iz0rmjm.mongodb.net/CourseApp',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)

app.listen(3000, () => {
  console.log('Server is listening on port 3000')
})
