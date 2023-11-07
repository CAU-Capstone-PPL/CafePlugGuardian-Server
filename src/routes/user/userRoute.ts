import { Request, Response, Router } from 'express';
import UserService from '../../services/user/userService';

const router = Router();

router.get('/login', async (req: Request, res: Response) => {
  const { userId, password } = req.params;

  try {
    const loginResponse = await UserService.verifyLogin(userId, password);

    if (!loginResponse) {
      return res.status(200).json(loginResponse);
    } else {
      return res.status(400).send();
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
