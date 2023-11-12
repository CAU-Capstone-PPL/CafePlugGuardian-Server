import users from "../../models/users";
import response from "../../helpers/response";
import BaseResponseStatus from "../../helpers/baseResponseStatus";

class UserService {
  async verifyLogin(userId: string, userPw: string) {
    const user = await users.findOne({ userId: userId });

    if (user && user.userPw === userPw) {
      return response(BaseResponseStatus.LOGIN_SUCCESS,
        { 'Authorization': 'test' }
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
