// const jwt = require('jsonwebtoken');
// const { Response } = require('express');
import { NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IRequest } from '../interfaces/IRequest';
import { IResponse } from '../interfaces/IResponse';

const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

const authenticateJwt = (req: IRequest, res: IResponse, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err: any, user: any ): void => {
      if (err) {
        res.sendStatus(403);
        return;
      }
      req.userId = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// module.exports = {
//     authenticateJwt,
//     SECRET
// }
export { authenticateJwt, SECRET }; 
