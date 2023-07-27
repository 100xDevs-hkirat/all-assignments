import jwt, { JwtPayload } from 'jsonwebtoken'; // Import VerifyErrors as well
import { Response, Request, NextFunction } from 'express';

// Define an interface to represent the JWT payload
interface UserPayload extends JwtPayload {
  id: string; // Assuming the 'id' property is a string, change it accordingly if needed
}

const SECRET = 'SECr3t'; // This should be in an environment variable in a real application

const authenticateJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      
      if (!user) { 
        return res.sendStatus(403);
      }

      const userPayload: UserPayload = user as UserPayload; // Type assertion
      req.headers.userId = userPayload.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export { authenticateJwt };
export { SECRET };
