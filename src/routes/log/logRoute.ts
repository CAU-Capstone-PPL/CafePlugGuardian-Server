import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import response from '../../helpers/response';
import LogService from '../../services/log/logService';

const router = Router();

router.patch('/check', wrapAsync(async (req: Request, res: Response)=> {
  const plugOffLogId = req.body.plugOffLogId;

  const checkManagerLogResponse = await LogService.checkManagerLog(plugOffLogId);
  const responseStatus = BaseResponseStatus.SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, checkManagerLogResponse));
}));

export default router;
