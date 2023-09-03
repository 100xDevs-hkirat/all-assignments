import express, { Request, Response } from 'express';
import * as ItemsController from '../controllers/items';
import authMiddleware from '../middlewares/auth';

const router = express.Router();

router.get('/', authMiddleware, ItemsController.getAll);

export default router;