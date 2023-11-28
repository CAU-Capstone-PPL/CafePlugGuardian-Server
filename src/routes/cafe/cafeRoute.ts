import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import CafeService from '../../services/cafe/cafeService';

const router = Router();

/**
 * 카페 추가 API
 * post: /api/cafe
 * params: userId (카페 사장 userId)
 * body: cafeName (카페 이름)
 */
router.post('/', wrapAsync(async (req: Request, res: Response) => {
  const userId = Number(req.body.userId);
  const cafeName = req.body.cafeName;

  const addCafeResponse = await CafeService.addCafe(userId, cafeName);

  if (addCafeResponse.success) {
    return res.status(200).json(addCafeResponse);
  } else {
    return res.status(400).json(addCafeResponse);
  }
}));

/**
 * 카페 목록 API
 * get: /api/cafe
 * params: userId (카페 주인 userId)
 */
router.get('/', wrapAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.userId);

  const cafeListResponse = await CafeService.getCafeList(userId);

  return res.status(200).json(cafeListResponse);
}));

/**
 * 카페 플러그 목록 API
 * get /api/cafe/:cafeId/plug
 * params: cafeId (카페 식별 번호)
 */
router.get('/:cafeId/plug', wrapAsync(async (req: Request, res: Response) => {
  const cafeId = Number(req.params.cafeId);

  const plugListResponse = await CafeService.getPlugList(cafeId);

  if (plugListResponse.success) {
    return res.status(200).json(plugListResponse);
  } else {
    return res.status(400).json(plugListResponse);
  }
}));

/**
 * 핀 번호 발급 API
 * get /api/cafe/:cafeId/pin
 * params: cafeId (카페 식별 번호)
 */
router.post('/:cafeId/pin', wrapAsync(async (req: Request, res: Response)=> {
  const cafeId = Number(req.params.cafeId);

  const getPinNumberResponse = await CafeService.getPinNumber(cafeId);

  if (getPinNumberResponse.success) {
    return res.status(200).json(getPinNumberResponse);
  } else {
    return res.status(400).json(getPinNumberResponse);
  }
}));

export default router;
