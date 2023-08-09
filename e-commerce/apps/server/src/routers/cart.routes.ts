import express, { Router } from "express";
import authMiddleware from "../middlewares/auth";
import { getCartController, addToCartController } from "../controllers/cart";

const router: Router = express.Router();

router.get('/', authMiddleware, getCartController);
router.post('/', authMiddleware, addToCartController);

export default router;