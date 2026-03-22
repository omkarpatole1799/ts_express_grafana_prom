import express from 'express';
import { login } from '../controllers/auth.controller';

const authRouter = express.Router();

authRouter.post('/login', login);

// authRouter.post('/logout');

export default authRouter;
