const jwt = require('jsonwebtoken');
import { Response, Request, NextFunction } from 'express';
const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

const authenticateJwt = (req : Request, res : Response, next : NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err : Error, user : any) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.body.userId = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = {
    authenticateJwt,
    SECRET
}
