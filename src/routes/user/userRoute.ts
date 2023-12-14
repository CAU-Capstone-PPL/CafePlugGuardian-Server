import { Request, Response, Router } from 'express';
import wrapAsync from '../../helpers/wrapFunction';
import UserService from '../../services/user/userService';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import response from '../../helpers/response';

const router = Router();

/**
 * 로그인 API
 * post: /api/user/login
 * body: userAccount(아이디), userPw(비밀번호)
 */
router.post('/login', wrapAsync(async (req: Request, res: Response) => {
  const { userAccount, userPw } = req.body;

  const loginResponse = await UserService.verifyLogin(userAccount, userPw);
  const responseStatus = BaseResponseStatus.LOGIN_SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, loginResponse));
}));

/**
 * 회원가입 API
 * post: /api/user/signUp
 * body: userAccount(아이디), userPw(비밀번호), userName(닉네임)
 */
router.post('/signUp',wrapAsync(async (req: Request, res: Response) => {
  const { userAccount, userPw, userName } = req.body;

  const signUpResponse = await UserService.signUp(userAccount, userPw, userName);
  const responseStatus = BaseResponseStatus.SIGNUP_SUCCESS;

  return res.status(responseStatus.status).json(response(responseStatus, signUpResponse));
}));

export default router;
