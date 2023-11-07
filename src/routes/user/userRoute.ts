import { Request, Response, Router } from 'express';
import response from '../../helpers/response';
import BaseResponseStatus from '../../helpers/baseResponseStatus';
import UserService from '../../services/user/userService';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  const { userId, password } = req.body;

  try {
    const loginResponse = await UserService.verifyLogin(userId, password);

    if (loginResponse) {
      return res.status(200).json(response(BaseResponseStatus.LOGIN_SUCCESS, loginResponse));
    } else {
      return res.status(400).json(response(BaseResponseStatus.LOGIN_FAIL));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(response(BaseResponseStatus.ERROR));
  }
});

export default router;
