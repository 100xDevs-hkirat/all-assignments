
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
export const SECRET = 'SECr3t';  

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, payload) => {
      if (err) {
        return res.sendStatus(403);
      }
      // req.headers["user-id"] = user.id; // directly it could be undefined or jwt.jwtpayload or string so it is complaining.
      //so
      if (!payload) {
        return res.sendStatus(403);  // if payload is undefined
      }
      // now it could be a string or jwt.jwtpayload
      // req.headers["user-id"] = payload.id;  // here it would complain what if it is a string then it could be undefined
      if (typeof payload === 'string') {
        return res.sendStatus(403);  // if payload is a string then d could be undefined so return 403
      }
      req.headers["user-id"] = payload.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


