import users from "../../models/users";

interface Ijwt {
  'Authorization': string
}

class UserService {
  async verifyLogin(userId: string, password: string): Promise<Ijwt | void> {
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
