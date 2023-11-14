import { Request, Response, Router } from 'express';
import CafeRoute from './cafe/cafeRoute';
import wrapAsync from '../../helpers/wrapFunction';
import UserService from '../../services/user/userService';

const router = Router();

router.use('/:userId/cafe', CafeRoute);

router.post('/login', wrapAsync(async (req: Request, res: Response) => {
  const { userAccount, userPw } = req.body;

  const loginResponse = await UserService.verifyLogin(userAccount, userPw);

  if (loginResponse.success) {
    return res.status(200).json(loginResponse);
  } else {
    return res.status(400).json(loginResponse);
  }
}));

router.post('/signUp',wrapAsync(async (req: Request, res: Response) => {
  const { userAccount, userPw, userName } = req.body;

  const signUpResponse = await UserService.signUp(userAccount, userPw, userName);

  if (signUpResponse.success) {
    return res.status(200).json(signUpResponse);
  } else {
    return res.status(400).json(signUpResponse);
  }
}));

export default router;
