import User from "../../models/User";

interface Ijwt {
  'Authorization': string
}

class UserService {
  async verifyLogin(userId: string, password: string): Promise<Ijwt | void> {
    try {
      const user = await User.findOne({userId: userId});

      if (user && user.password === password) {
        let token: Ijwt = {'Authorization': 'test'};
        return token;
      } else {
        return;
      }
    } catch (error) {
      throw new Error(`로그인 검증에 실패했습니다: ${error}`);
    }
  }
}

export default new UserService();
