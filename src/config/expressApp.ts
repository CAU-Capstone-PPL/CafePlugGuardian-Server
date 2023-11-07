import express from 'express';
import cors from 'cors';
import apiRouter from '../routes/apiRoute';

function configureExpressApp() {
  const app = express();

  //미들웨어
  app.use(express.json());
  app.use(cors());

  //라우터
  app.use('/api', apiRouter);

  return app;
}

export default configureExpressApp;
