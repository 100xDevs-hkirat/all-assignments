import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { Request, Response, NextFunction } from "express";
import { toErrorWithMessage } from "./error";
import { z } from "zod";

const ZoDInputId = z.string()

export const authenticateJwt = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token: string = authHeader.split(" ")[1];
    let decoded: string | JwtPayload;
    try {
      decoded = jwt.verify(token, config.SECRET);
    } catch (err) {
      const msg: string = toErrorWithMessage(err).message;
      return res.status(401).json({ message: msg });
    }
    if (!decoded || typeof decoded == "string") {
      return res.sendStatus(403);
    }
    const parsedInput = ZoDInputId.safeParse(decoded.id);
    if (!parsedInput.success) {
      const ans = { message: JSON.stringify(parsedInput.error) };
      return res.status(411).json(ans);
    }
    req.headers["userId"] = parsedInput.data;
    next();
} else {
    res.sendStatus(401);
  }
};
