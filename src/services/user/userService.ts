import Users from '../../models/users';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import jwt from 'jsonwebtoken';
import HttpError from '../../helpers/httpError';

class UserService {
  async verifyLogin(userAccount: string, userPw: string) {
    const user = await Users.findOne({ userAccount: userAccount });

    if (!user || user.userPw !== userPw) {
      throw new HttpError(BaseResponseStatus.LOGIN_FAIL);
    }

    const secretKey: string | undefined = process.env.SECRET_KEY;
    if (secretKey == undefined) {
      throw new HttpError(BaseResponseStatus.SECRET_KEY_UNDEFINED);
    }

    return jwt.sign(
      {
        userId: user.userId,
        userAccount: user.userAccount,
        userName: user.userName
      },
      secretKey,
      {expiresIn: '1h'}
    );
  }

  async signUp(userAccount: string, userPw: string, userName: string) {
    const existingUser = await Users.findOne({ userAccount: userAccount });
    if(existingUser) {
      throw new HttpError(BaseResponseStatus.SIGNUP_DUPLICATE);
    }

    const lastUser = await Users.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 1;

    const user = new Users({
      userId: userId,
      userAccount: userAccount,
      userPw: userPw,
      userName: userName
    });
    await user.save();

    return;
  }
}

export default new UserService();
