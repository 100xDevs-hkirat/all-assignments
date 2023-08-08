import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

import connectDB from './config/db';

import itemsRouter from './routers/items';
import authRouter from './routers/auth';

dotenv.config();
connectDB();

const PORT: number = parseInt(process.env.PORT as string, 10);
if(!PORT) {
    process.exit(1);
}

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/items', itemsRouter); 
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Listening on port  ${PORT}`);
});