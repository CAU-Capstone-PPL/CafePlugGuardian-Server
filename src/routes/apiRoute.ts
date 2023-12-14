import { Router } from 'express';
import userRouter from './user/userRoute';
import cafeRouter from './cafe/cafeRoute';
import plugRouter from './plug/plugRoute';
import mileageRouter from './mileage/mileageRoute';
import logRouter from './log/logRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/cafe', cafeRouter);
router.use('/plug', plugRouter);
router.use('/log', logRouter);
router.use('/mileage', mileageRouter);

export default router;
