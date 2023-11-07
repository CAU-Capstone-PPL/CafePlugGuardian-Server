import express from 'express';
import cors from 'cors';
import methodOverride from 'method-override';
import apiRouter from '../routes/apiRoute';

function configureExpressApp() {
  const app = express();

  //미들웨어
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(methodOverride());

  //라우터
  app.use('/api', apiRouter);

  return app;
}

export default configureExpressApp;
