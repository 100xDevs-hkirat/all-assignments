import { Request, Response } from 'express';
import { IItem } from '../interfaces/item';
import * as itemsService from '../services/items';

export const getAll = async (req: Request, res:Response) => {
    try {
        const data = await itemsService.findAll();
        res.status(data.statusCode).json(data.body);
    } catch(e) {
        console.log(e);
        res.sendStatus(500);
    }
}