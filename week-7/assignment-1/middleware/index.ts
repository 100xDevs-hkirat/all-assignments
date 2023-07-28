// const jwt = require('jsonwebtoken');
// const { Response } = require('express');

import jwt from 'jsonwebtoken'
const SECRET = 'SECr3t';  // This should be in an environment variable in a real application
import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
  userId: string;
  id: string;
}

const authenticateJwt = (req:AuthenticatedRequest, res:Response, next:NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err || !user) {
        return res.sendStatus(403);
      }
      if (typeof user === 'string') {
        req.userId = user;
      } else {
        req.userId = user.id as string;
      }
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export {
    authenticateJwt,
    SECRET
}
