// const jwt = require('jsonwebtoken');
// const { Response } = require('express');
import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

export const SECRET = "SECr3t"; // This should be in an environment variable in a real application

//icould also use the extended property of interface to introduce one more property userId
//but for now i am storing userId in headers
export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      // req.userId = user.id;
      if (!user) {
        return res.sendStatus(403);
      }
      if (typeof user === "string") {
        return res.sendStatus(403);
      }
      req.headers["userId"] = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
