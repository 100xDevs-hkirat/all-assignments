//const jwt = require('jsonwebtoken');
import jwt from 'jsonwebtoken'
//import UserId from '../types/type';
//const { Response } = require('express');
import { Request, Response, NextFunction } from 'express';

export const SECRET: string = 'SECr3t';  // This should be in an environment variable in a real application

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, SECRET) as { [key: string]: any };
      req.headers.userId = decoded.id
      next()
    } catch (err) {
      if (err) {
        return res.sendStatus(403);
      }
    }
  } else {
    res.sendStatus(401);
  }
};


