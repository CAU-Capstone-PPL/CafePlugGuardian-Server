import { Request, Response, NextFunction } from 'express';
import response from '../helpers/response';
import {BaseResponseStatus} from '../helpers/baseResponseStatus';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const secretKey: string | undefined = process.env.SECRET_KEY;

  if (secretKey == undefined) {
    return res.status(500).json(response(BaseResponseStatus.SECRET_KEY_UNDEFINED));
  }

  const token = req.header('Authorization')?.split('Bearer ')[1];

  if (token == null) {
    return res.status(401).json(response(BaseResponseStatus.JWT_TOKEN_NULL));
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      return res.status(403).json(response(BaseResponseStatus.JWT_FORBIDDEN));
    }
    req.user = user;
    next();
  });
}
