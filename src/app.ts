import express from 'express';
import dotenv from 'dotenv';
import indexRouter from './routes/index/index';

if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './config/.env.production.local' });
} else if (process.env.NODE_ENV === 'development') {
  dotenv.config({ path: './config/.env.development.local' });
} else if (process.env.NODE_ENV === 'test') {
  dotenv.config({ path: './config/.env.test.local' });
}

const app = express();
const port = 8080;

//미들웨어
app.use(express.json());

//라우터
app.use('/', indexRouter);

//서버 시작
app.listen(port);