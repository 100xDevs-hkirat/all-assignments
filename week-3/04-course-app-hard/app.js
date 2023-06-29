const express = require("express");
const bodyParser = require("body-parser");
require("express-async-errors");
const mongoose = require("mongoose");

const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/user");
const errorHandler = require("./middlewares/error-handler");

const app = express();
app.use(bodyParser.json());

app.use(adminRoutes);
app.use(userRoutes);

app.use("*", async (req, res) => {
  return res.status(404).json({ errors: [{ message: "Not found" }] });
});

app.use(errorHandler);

module.exports = app;
