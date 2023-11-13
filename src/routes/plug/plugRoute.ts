import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import PlugService from '../../services/plug/plugService';

const router = Router();

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
