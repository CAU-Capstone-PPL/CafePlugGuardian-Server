import { Router } from 'express';
import userRouter from './user/userRoute';
import cafeRouter from './cafe/cafeRoute';
import plugRouter from './plug/plugRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/cafe', cafeRouter);
router.use('/plug', plugRouter);

export default router;
