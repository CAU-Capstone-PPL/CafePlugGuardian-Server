import { Router } from 'express';
import userRouter from './user/userRoute';

const router = Router();

router.use('/user', userRouter);

export default router;
