const mongoose = require('mongoose');
const express = require('express');
const app = require('./app')

require("dotenv").config("../local.env");

const DATABASE  = process.env.DATABASEURL.replace('<password>', process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,

}).then(() => console.log("Database connection is succesful"))

app.listen(3001,() => {
    console.log("App is running on 3001");
    
})