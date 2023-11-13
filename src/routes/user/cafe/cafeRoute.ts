import { Request, Response, Router } from 'express';
import wrapAsync from '../../../helpers/wrapFunction';
import CafeService from '../../../services/user/cafe/cafeService';

const router = Router();

router.post('/', wrapAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);
  const cafeName = req.body.cafeName;

  const addCafeResponse = await CafeService.addCafe(userId, cafeName);

  if (addCafeResponse.success) {
    return res.status(200).json(addCafeResponse);
  } else {
    return res.status(400).json(addCafeResponse);
  }
}));

router.get('/info', wrapAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  const cafeListResponse = await CafeService.getCafeList(userId);

  return res.status(200).json(cafeListResponse);
}));

export default router;
