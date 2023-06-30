const express = require('express');
const app = express();

app.use(express.json());

let ADMINS = [];
let USERS = [];
let COURSES = [];


const userRouter = require('./routes/user');
const adminRouter = require('./routes/admin');

app.use('/users',userRouter);
app.use('/admin',adminRouter);


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
