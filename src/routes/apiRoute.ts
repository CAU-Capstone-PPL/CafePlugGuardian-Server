import { Router } from 'express';
import userRouter from './user/userRoute';
import cafeRouter from './cafe/cafeRoute';
import plugRouter from './plug/plugRoute';
import mileageRoute from './mileage/mileageRoute';

const router = Router();

router.use('/user', userRouter);
router.use('/cafe', cafeRouter);
router.use('/plug', plugRouter);
router.use('/mileage', mileageRoute);

export default router;
