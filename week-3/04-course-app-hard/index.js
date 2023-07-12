const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

app.use('/users',userRouter);
app.use('/admin',adminRouter);


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
