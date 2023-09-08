const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

app.use('/admin', adminRouter);
app.use('/user', userRouter);

// Connect to MongoDB
// DONT MISUSE THIS THANKYOU!!
mongoose.connect(
  // 'mongodb+srv://kirattechnologies:iRbi4XRDdM7JMMkl@cluster0.e95bnsi.mongodb.net/courses',
  // 'mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false/courses'
  'mongodb://localhost:27017/courses',
  { useNewUrlParser: true, useUnifiedTopology: true, dbName: 'courses' }
);

app.listen(3000, () => console.log('Server running on port 3000'));
