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

export default router;
