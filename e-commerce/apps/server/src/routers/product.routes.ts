import express, { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import { createProductController, updateProductController, deleteProductController, getAllProductsController, getProductByIdController } from '../controllers/product';

const router: Router = express.Router();

router.get('/', authMiddleware, getAllProductsController);
router.get('/:id', authMiddleware, getProductByIdController);
router.post('/', authMiddleware, createProductController);
router.put('/:id', authMiddleware, updateProductController);
router.delete('/:id', authMiddleware, deleteProductController);

export default router;