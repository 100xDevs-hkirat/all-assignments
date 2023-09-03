import express, { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;
if(!JWT_SECRET) {
    console.log("Jwt secret missing");
    process.exit(1);
}

const auth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    // console.log(token);
    if(!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { username: string};
        // console.log(decoded);
        (req as any).username = decoded.username;
        // console.log((req as any).username, decoded.user);
        next();
    } catch(e) {
        res.status(401).json({ message: 'Token is not valid' });
    }
}

export default auth;