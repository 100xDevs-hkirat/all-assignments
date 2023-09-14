import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import {z} from 'zod';

export const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

export const authenticateJwt = (req : Request, res : Response, next : NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      if ((user === undefined) || (typeof user === 'string')) {
        return res.sendStatus(403);
      }
      req.headers['userId'] = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

const TodoSchema = z.object({
  title : z.string().min(3),
  description : z.string().min(10)
})

export const validateTodo = (req : Request, res : Response, next : NextFunction) => {
  const { title, description } = req.body;
  const validationResult = TodoSchema.safeParse({ title, description });

  if (validationResult.success === false) {
    const errorMessages = validationResult.error.errors.map((err) => {
      const fieldName = err.path.join('.');
      return `${fieldName} ${err.message}`;
    });
    return res.status(409).json({ error: 'Validation failed', details: errorMessages });
  }
  next();
};



