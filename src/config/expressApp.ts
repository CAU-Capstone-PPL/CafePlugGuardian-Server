import express from 'express';
import cors from 'cors';
import methodOverride from 'method-override';
import apiRouter from '../routes/apiRoute';
import errorHandler from '../helpers/errorHandler';

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
  app.use(errorHandler);

  return app;
}

export default configureExpressApp;
