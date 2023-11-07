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
      throw error;
    }
  }
}

export default new UserService();
