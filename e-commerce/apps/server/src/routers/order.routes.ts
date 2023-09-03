import express, { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import { getOrderController, createOrderController } from '../controllers/order';


const router: Router = express.Router();

router.get('/', authMiddleware, getOrderController);
router.post('/', authMiddleware, createOrderController);

export default router;