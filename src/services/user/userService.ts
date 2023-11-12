import users from "../../models/users";
import response from "../../helpers/response";
import BaseResponseStatus from "../../helpers/baseResponseStatus";
import jwt from "jsonwebtoken";

class UserService {
  async verifyLogin(userId: string, userPw: string) {
    const user = await users.findOne({ userId: userId });

    if (user && user.userPw === userPw) {
      const secretKey: string | undefined = process.env.SECRET_KEY;
      if (secretKey == undefined) {
        return response(BaseResponseStatus.SECRET_KEY_UNDEFINED);
      }

      const token = jwt.sign(
        {
          userId: user.userId,
          userName: user.userName
        },
        secretKey,
        { expiresIn: '1h' }
      );

      return response(BaseResponseStatus.LOGIN_SUCCESS,
        { 'Authorization': token }
      );
    } else {
      return response(BaseResponseStatus.LOGIN_FAIL);
    }
  }

  async signUp(userId: string, userPw: string, userName: string) {
    const existingUser = await users.findOne({ userId });
    if(existingUser) {
      return response(BaseResponseStatus.SIGNUP_DUPLICATE);
    }

    const user = new users({
      userId: userId,
      userPw: userPw,
      userName: userName
    });
    await user.save();

    return response(BaseResponseStatus.SIGNUP_SUCCESS);
  }
}

export default new UserService();
