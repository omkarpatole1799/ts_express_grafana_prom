import express from 'express';
import { register } from '../controllers/index.controller';
import authRouter from './auth.routes';
import { shortUrl } from '../controllers/url.controller';

const indexRouter = express.Router();

indexRouter.post('/register', register);

indexRouter.use('/auth', authRouter);

indexRouter.post('/short', shortUrl);

export default indexRouter;
