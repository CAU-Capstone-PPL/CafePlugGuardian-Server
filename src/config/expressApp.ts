import express from 'express';
import indexRouter from "../routes/index";

function configureExpressApp() {
  const app = express();

  //미들웨어
  app.use(express.json());

  //라우터
  app.use('/', indexRouter);

  return app;
}

export default configureExpressApp;