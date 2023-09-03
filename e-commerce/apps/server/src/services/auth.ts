import jwt from 'jsonwebtoken';
import User from '../models/User';

const { JWT_SECRET } = process.env;

if(!JWT_SECRET) {
    console.log("Jwt secret missing");
    process.exit(1);
}

export const genToken = (username: string) => {
    const payload = { username };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1hr' });
}

export const verifyToken = (token: string) => {
    return jwt.verify(token, JWT_SECRET) as { username: string };
}

export const register = async ( username: string, password: string): Promise<{ token: string }> => {
    const existingUser = await User.findOne({ username });
    if(existingUser) {
        throw new Error("User already exists");
    }   

    const user = new User({ username, password });
    await user.save();
    return { token: genToken(username) };
}