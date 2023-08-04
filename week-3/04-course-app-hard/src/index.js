// const express = require("express");
import express from "express";
import bodyParser from "body-parser";

import connect from "./config/db-config.js";

const setUp_Server = async () => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // function generatejwt(payload) {
  //   console.log(payload);
  //   let token = jwt.sign(
  //     { username: payload.username, id: payload._id, role: payload.role },
  //     SECRET,
  //     {
  //       expiresIn: "1h",
  //     }
  //   );
  //   return token;
  // }
  connect();
  app.listen(3000, () => {
    console.log("Server is listening on port 3000");
    console.log("db connected");
  });
};

setUp_Server();
