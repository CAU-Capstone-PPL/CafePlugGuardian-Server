import users from "../../models/users";

interface Ijwt {
  'Authorization': string
}

class UserService {
  async verifyLogin(userId: string, userPw: string): Promise<Ijwt | void> {
    try {
      /*
      const test = new users({
        userId: "testidid",
        password: "12345",
        userName: "testName"
      });

      await test.save();
      */

      const user = await users.findOne({userId: userId});

      if (user && user.userPw === userPw) {
        let token: Ijwt = {'Authorization': 'test'};
        return token;
      } else {
        return;
      }
    } catch (error) {
      throw error;
    }
  }

  async signUp(userId: string, userPw: string, userName: string) {
    try {
      const existingUser = await users.findOne({ userId });
      if(existingUser) {
        return;
      }
    } catch (error) {
      throw error;
    }
  }
}

export default new UserService();
