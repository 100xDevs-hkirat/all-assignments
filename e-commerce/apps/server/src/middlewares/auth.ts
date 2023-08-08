import express, { Request, Response, NextFunction} from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from 'common';

const { JWT_SECRET } = process.env;
if(!JWT_SECRET) {
    console.log("Jwt secret missing");
    process.exit(1);
}

interface c extends Request, IUser {

}

const auth = (req: c, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if(!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { user: string};
        req.username = decoded.user;
        next();
    } catch(e) {
        console.log(e);
        res.status(401).json({ message: 'Token is not valid' });
    }
}

export default auth;