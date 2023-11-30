import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import CafeService from '../../services/cafe/cafeService';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import response from '../../helpers/response';

const router = Router();

/**
 * 카페 추가 API
 * post: /api/cafe
 * body: userId (카페 사장 userId), cafeName (카페 이름)
 */
router.post('/', wrapAsync(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const cafeName = req.body.cafeName;

  const addCafeResponse = await CafeService.addCafe(userId, cafeName);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, addCafeResponse));
}));

/**
 * 카페 목록 API
 * get: /api/cafe
 * query: userId (카페 주인 userId)
 */
router.get('/', wrapAsync(async (req: Request, res: Response) => {
  const userId = Number(req.query.userId);

  const cafeListResponse = await CafeService.getCafeList(userId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, cafeListResponse));
}));

/**
 * 카페 플러그 목록 API
 * get /api/cafe/:cafeId/plug
 * params: cafeId (카페 식별 번호)
 */
router.get('/:cafeId/plug', wrapAsync(async (req: Request, res: Response) => {
  const cafeId = Number(req.params.cafeId);

  const plugListResponse = await CafeService.getPlugList(cafeId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, plugListResponse));
}));

/**
 * 핀 번호 발급 API
 * post /api/cafe/:cafeId/pin
 * params: cafeId (카페 식별 번호)
 */
router.post('/:cafeId/pin', wrapAsync(async (req: Request, res: Response)=> {
  const cafeId = Number(req.params.cafeId);

  const getPinNumberResponse = await CafeService.getPinNumber(cafeId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, getPinNumberResponse));
}));

/**
 * 관리자용 앱 카페 내 비허용 기기 차단 로그
 * get /api/cafe/:cafeId/blockingLog
 * params: cafeId (카페 식별 번호)
 */
router.post('/:cafeId/blockingLog', wrapAsync(async (req: Request, res: Response)=> {
  const cafeId = Number(req.params.cafeId);

  const getCafePlugBlockingLogResponse = await CafeService.getCafePlugBlockingLog(cafeId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, getCafePlugBlockingLogResponse));
}));

export default router;
