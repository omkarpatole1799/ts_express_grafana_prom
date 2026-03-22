import express from 'express';
import { register } from '../controllers/index.controller';
import authRouter from './auth.routes';

const indexRouter = express.Router();

indexRouter.post('/register', register);

indexRouter.use('/auth', authRouter);

export default indexRouter;
