import express from 'express';
import apiRouter from '../routes/apiRoute';

function configureExpressApp() {
  const app = express();

  //미들웨어
  app.use(express.json());

  //라우터
  app.use('/api', apiRouter);

  return app;
}

export default configureExpressApp;
