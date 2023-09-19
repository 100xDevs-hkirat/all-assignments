const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyparser.json());

const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');



app.use('/api/v1', authRouter)
app.use('/api/v1/user',userRouter);
app.use('/api/v1/admin',adminRouter);





module.exports = app;