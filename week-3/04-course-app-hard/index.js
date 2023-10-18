const express = require('express');
const mongoose = require('mongoose');
const app = express();
const jwt = require('jsonwebtoken');
const cors = require("cors");

require('dotenv').config();


mongoose.connect(process.env.MONGO_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});


app.use(express.json());
app.use(cors());

app.use("/admin", require('./server/routes/admin'))
app.use("/users", require('./server/routes/user'))


app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
