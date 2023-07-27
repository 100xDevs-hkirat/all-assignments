import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { z } from "zod";
export const SECRET = "SECr3t"; // This should be in an environment variable in a real application

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, SECRET, (err, user: any) => {
      if (err || !user) {
        return res.sendStatus(403);
      }
      req.headers["userId"] = user?.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
