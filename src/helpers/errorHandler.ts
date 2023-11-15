import { Request, Response, NextFunction } from 'express';
import response from "./response";
import BaseResponseStatus from "./baseResponseStatus";

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error.stack);
  res.status(500).json(response(BaseResponseStatus.ERROR));
}
