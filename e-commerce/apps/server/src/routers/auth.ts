import express, { Router, Request, Response } from 'express';
import auth_middleware from '../middlewares/auth';
import { register, login } from '../controllers/auth';

const router: Router = express.Router();

router.post('/signup', register);
router.post('/login', login);

export default router;