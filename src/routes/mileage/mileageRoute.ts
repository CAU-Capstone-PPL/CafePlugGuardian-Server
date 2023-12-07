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
 * query: plugId
 */
router.get('/', requireToken, wrapAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const plugId = Number(req.query.plugId);

  const getMileageResponse = await mileageService.getMileage(userId, plugId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, getMileageResponse));
}));

/**
 * 마일리지 사용 API
 * patch: /api/mileage
 * header: Authorization(jwt 토큰)
 * query: menuId
 */
router.patch('/', requireToken, wrapAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const menuId = Number(req.query.menuId);

  const useMileageResponse = await mileageService.useMileage(userId, menuId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, useMileageResponse));
}));

/**
 * 잔여 전력 마일리지 전환 API
 * patch: /api/mileage/remainPower
 * header: Authorization(jwt 토큰)
 * body: plugUseId, mileage
 */
router.patch('/remainPower', requireToken, wrapAsync(async (req: Request, res: Response) => {
  const userId = req.user.userId;
  const plugUseId = req.body.plugUseId;
  const mileage = req.body.mileage;

  const addRemainPowerMileageResponse = await mileageService.addRemainPowerMileage(userId, plugUseId, mileage);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, addRemainPowerMileageResponse));
}));

/**
 * 마일리지 부여 테스트 API
 * patch: /api/mileage/testGain
 * body: userId, cafeId, mileage
 */
router.patch('/testGain', wrapAsync(async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const cafeId = req.body.cafeId;
  const mileage = req.body.mileage;

  const testMileageResponse = await mileageService.modifyMileage(userId, cafeId, mileage);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, testMileageResponse));
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
 * body: cafeId, menuName, menuPrice, menuDescription
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

/**
 * 마일리지 상점 메뉴 수정 API
 * patch: /api/mileage/menu
 * body: menuId, menuName, menuPrice, menuDescription
 */
router.patch('/menu', wrapAsync(async (req: Request, res: Response) => {
  const menuId = req.body.menuId;
  const menuName = req.body.menuName;
  const menuPrice = req.body.menuPrice;
  const menuDescription = req.body.menuDescription;

  const modifyMenuResponse = await mileageService.modifyMenu(menuId, menuName, menuPrice, menuDescription);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, modifyMenuResponse));
}));

/**
 * 마일리지 상점 메뉴 삭제 API
 * delete: /api/mileage/menu
 * body: menuId
 */
router.delete('/menu', wrapAsync(async (req: Request, res: Response) => {
  const menuId = req.body.menuId;

  const deleteMenuResponse = await mileageService.deleteMenu(menuId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, deleteMenuResponse));
}));

export default router;
