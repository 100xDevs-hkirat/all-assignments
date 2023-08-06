import express, { Request, Response } from 'express';
import { IItem } from '../interfaces/item';
import * as ItemsController from '../controllers/items';

export const router = express.Router();

router.get('/', ItemsController.getAll);