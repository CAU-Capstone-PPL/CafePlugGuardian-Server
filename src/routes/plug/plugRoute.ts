import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import PlugService from '../../services/plug/plugService';

const router = Router();

/**
 * 플러그 공장 생산 API
 * 새로 생산된 스마트 플러그를 db에 저장하는 api, 프론트에서 사용 x
 * post: /api/plug
 */
router.post('/', wrapAsync(async (req: Request, res: Response) => {
  const newPlugResponse = await PlugService.newPlug();

  return res.status(200).json(newPlugResponse);
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

  if (connectPlugResponse.success) {
    return res.status(200).json(connectPlugResponse);
  } else {
    return res.status(400).json(connectPlugResponse);
  }
}));

/**
 * 플러그 1개 정보 API
 * get: /api/plug/:plugId/info
 * params: plugId (플러그 식별 번호)
 */
router.get('/:plugId/info', wrapAsync(async (req: Request, res: Response) => {
  const plugId = Number(req.params.plugId);

  const plugInfoResponse = await PlugService.getPlugInfo(plugId);

  if (plugInfoResponse.success) {
    return res.status(200).json(plugInfoResponse);
  } else {
    return res.status(400).json(plugInfoResponse);
  }
}));

/**
 * 플러그 토글 ON API
 * patch: /api/plug/:plugId/turnOn
 * params: plugId (플러그 식별 번호)
 */
router.patch('/:plugId/turnOn', wrapAsync(async (req: Request, res: Response)=> {
  const plugId = Number(req.params.plugId);

  const plugTurnOnResponse = await PlugService.togglePlug(plugId, true);

  if (plugTurnOnResponse.success) {
    return res.status(200).json(plugTurnOnResponse);
  } else {
    return res.status(400).json(plugTurnOnResponse);
  }
}));

/**
 * 플러그 토글 OFF API
 * patch: /api/plug/:plugId/turnOff
 * params: plugId (플러그 식별 번호)
 */
router.patch('/:plugId/turnOff', wrapAsync(async (req: Request, res: Response)=> {
  const plugId = Number(req.params.plugId);

  const plugTurnOffResponse = await PlugService.togglePlug(plugId, false);

  if (plugTurnOffResponse.success) {
    return res.status(200).json(plugTurnOffResponse);
  } else {
    return res.status(400).json(plugTurnOffResponse);
  }
}));

export default router;
