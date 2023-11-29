import { Request, Response, NextFunction } from 'express';
import {BaseResponseStatus} from '../helpers/baseResponseStatus';
import jwt from 'jsonwebtoken';
import HttpError from '../helpers/httpError';

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
    throw new HttpError(BaseResponseStatus.SECRET_KEY_UNDEFINED);
  }

  const token = req.header('Authorization')?.split('Bearer ')[1];

  if (token == null) {
    throw new HttpError(BaseResponseStatus.JWT_TOKEN_NULL);
  }

  jwt.verify(token, secretKey, (err: any, user: any) => {
    if (err) {
      throw new HttpError(BaseResponseStatus.JWT_FORBIDDEN);
    }
    req.user = user;
    next();
  });
}
