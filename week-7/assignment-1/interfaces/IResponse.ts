import { Response } from 'express';

export interface IResponse extends Response {
    userId?: string;
    username?: string;
    password?: string;
    message?: string;
}