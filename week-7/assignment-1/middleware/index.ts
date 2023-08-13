import jwt, { JwtPayload, VerifyErrors, VerifyOptions } from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'
import { type } from 'os';
export const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

export const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }
      if(!decoded || typeof decoded == 'string' || !decoded._id) {
        return res.sendStatus(401);    
      }
      req.headers["userId"] = decoded._id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};


