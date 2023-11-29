import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import PlugService from '../../services/plug/plugService';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import response from '../../helpers/response';

const router = Router();

/**
 * 플러그 공장 생산 API
 * 새로 생산된 스마트 플러그를 db에 저장하는 api, 프론트에서 사용 x
 * post: /api/plug
 */
router.post('/', wrapAsync(async (req: Request, res: Response) => {
  const newPlugResponse = await PlugService.newPlug();
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, newPlugResponse));
}));

/**
 * 플러그 연결 API
 * patch: /api/plug
 * query: topic (플러그 mqtt 토픽)
 * body: cafeId (카페 식별 번호)
 */
router.patch('/', wrapAsync(async (req: Request, res: Response) => {
  const topic = req.query.topic as string;
  const cafeId = req.body.cafeId;

  const connectPlugResponse = await PlugService.connectPlug(topic, cafeId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, connectPlugResponse));
}));

/**
 * 플러그 1개 정보 API
 * get: /api/plug/:plugId/info
 * params: plugId (플러그 식별 번호)
 */
router.get('/:plugId/info', wrapAsync(async (req: Request, res: Response) => {
  const plugId = Number(req.params.plugId);

  const plugInfoResponse = await PlugService.getPlugInfo(plugId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, plugInfoResponse));
}));

/**
 * 플러그 토글 ON API
 * patch: /api/plug/:plugId/turnOn
 * params: plugId (플러그 식별 번호)
 */
router.patch('/:plugId/turnOn', wrapAsync(async (req: Request, res: Response)=> {
  const plugId = Number(req.params.plugId);

  const plugTurnOnResponse = await PlugService.togglePlug(plugId, true);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, plugTurnOnResponse));
}));

/**
 * 플러그 토글 OFF API
 * patch: /api/plug/:plugId/turnOff
 * params: plugId (플러그 식별 번호)
 */
router.patch('/:plugId/turnOff', wrapAsync(async (req: Request, res: Response)=> {
  const plugId = Number(req.params.plugId);

  const plugTurnOffResponse = await PlugService.togglePlug(plugId, false);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, plugTurnOffResponse));
}));

/**
 * 플러그 고객 사용 API
 * post: /api/plug/:plugId/use
 * params: plugId (플러그 식별 번호)
 * body: pinNumber
 */
router.post('/:plugId/use', wrapAsync(async (req: Request, res: Response) => {
  const plugId = Number(req.params.plugId);
  const pinNumber = req.body.pinNumber;

  const usePlugResponse = await PlugService.usePlug(plugId, pinNumber);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, usePlugResponse));
}));

/**
 * 플러그 사용 종료 API
 * post: /api/plug/:plugId/stop
 * params: plugId (플러그 식별 번호)
 */
router.post('/:plugId/use', wrapAsync(async (req: Request, res: Response) => {
  const plugId = Number(req.params.plugId);

  const stopPlugResponse = await PlugService.stopPlug(plugId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, stopPlugResponse));
}));

export default router;
