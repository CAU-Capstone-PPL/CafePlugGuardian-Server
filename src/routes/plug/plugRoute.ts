import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import PlugService from '../../services/plug/plugService';

const router = Router();

router.post('/', wrapAsync(async (req: Request, res: Response) => {
  //새로 생산된 스마트 플러그를 db에 저장하는 api, 프론트에서 사용 x
  const newPlugResponse = await PlugService.newPlug();

  return res.status(200).json(newPlugResponse);
}));

router.get('/:plugId/info', wrapAsync(async (req: Request, res: Response) => {
  const plugId = Number(req.params.plugId);

  const plugInfoResponse = await PlugService.getPlugInfo(plugId);

  if (plugInfoResponse.success) {
    return res.status(200).json(plugInfoResponse);
  } else {
    return res.status(400).json(plugInfoResponse);
  }
}));

router.put('/:plugId/turnOn', wrapAsync(async (req: Request, res: Response)=> {
  const plugId = Number(req.params.plugId);

  const plugTurnOnResponse = await PlugService.togglePlug(plugId, true);

  if (plugTurnOnResponse.success) {
    return res.status(200).json(plugTurnOnResponse);
  } else {
    return res.status(400).json(plugTurnOnResponse);
  }
}));

router.put('/:plugId/turnOff', wrapAsync(async (req: Request, res: Response)=> {
  const plugId = Number(req.params.plugId);

  const plugTurnOffResponse = await PlugService.togglePlug(plugId, false);

  if (plugTurnOffResponse.success) {
    return res.status(200).json(plugTurnOffResponse);
  } else {
    return res.status(400).json(plugTurnOffResponse);
  }
}));

export default router;
