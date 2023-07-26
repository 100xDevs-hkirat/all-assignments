import { Request } from 'express';
import { IUser } from './IUser';

export interface IRequest extends Request, Partial<IUser> {
    
}