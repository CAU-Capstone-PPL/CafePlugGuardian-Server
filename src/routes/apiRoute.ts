import { Router } from 'express';
import userRouter from './user/userRoute';
import plugRouter from './plug/plugRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/plug', plugRouter);

export default router;
