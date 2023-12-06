import {Request, Response, Router} from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import {requireToken} from '../../middlewares/jwtMiddleware';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import mileageService from '../../services/mileage/mileageService';
import response from '../../helpers/response';

const router = Router();

/**
 * 마일리지 확인 API
 * get: /api/mileage
 * header: Authorization(jwt 토큰)
 * query: cafeId
 */
router.get('/', requireToken, wrapAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const cafeId = Number(req.query.cafeId);

  const getMileageResponse = await mileageService.getMileage(userId, cafeId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, getMileageResponse));
}));

/**
 * 마일리지 상점 메뉴 리스트 API
 * get: /api/mileage/menu
 * query: cafeId, plugId (둘 중 하나만 있어도 되고, cafeId를 우선시)
 */
router.get('/menu', wrapAsync(async (req: Request, res: Response) => {
  const cafeId = Number(req.query.cafeId);
  const plugId = Number(req.query.plugId);

  const getMenuResponse = await mileageService.getMenu(cafeId, plugId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, getMenuResponse));
}));

export default router;
