import { Request, Response, NextFunction } from 'express';
import response from './response';
import HttpError from './httpError';

function errorHandler(error: HttpError, req: Request, res: Response, next: NextFunction) {
  console.error(error.stack);
  const status = error.responseStatus.status;
  res.status(status).json(response(error.responseStatus));
}

export default errorHandler;
