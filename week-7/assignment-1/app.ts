import express from 'express';
import cors from 'cors';
import auth   from './routes/auth';
import todo from './routes/todo';


const PORT = 4000;

const app: express.Application = express();

app.use(cors());
app.use(express.json());
app.use('/auth', auth);
app.use('/todo', todo);

app.use("*", (req, res) => {
res.status(404).json("hkd;");
});

module.exports = app;