import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import methodOverride from 'method-override';
import apiRouter from '../routes/apiRoute';
import errorHandler from '../helpers/errorHandler';
import HttpError from '../helpers/httpError';
import {BaseResponseStatus} from '../helpers/baseResponseStatus';

function configureExpressApp() {
  const app = express();

  //미들웨어
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(methodOverride());

  //라우터
  app.use('/api', apiRouter);

  //에러 핸들러
  app.use((req: Request, res: Response, next: NextFunction) => {
    throw new HttpError(BaseResponseStatus.NOT_FOUND);
  });
  app.use(errorHandler);

  return app;
}

export default configureExpressApp;
