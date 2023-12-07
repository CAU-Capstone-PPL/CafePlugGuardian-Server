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
  const plugId = Number(req.query.plugId);

  const getMileageResponse = await mileageService.getMileage(userId, plugId);
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

/**
 * 마일리지 상점 메뉴 추가 API
 * post: /api/mileage/menu
 * params: cafeId, menuName, menuPrice, menuDescription
 */
router.post('/menu', wrapAsync(async (req: Request, res: Response) => {
  const cafeId = req.body.cafeId;
  const menuName = req.body.menuName;
  const menuPrice = req.body.menuPrice;
  const menuDescription = req.body.menuDescription;

  const addMenuResponse = await mileageService.addMenu(cafeId, menuName, menuPrice, menuDescription);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, addMenuResponse));
}));

export default router;
