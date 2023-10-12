import express from 'express';
import indexRouter from './routes/index/index'

const app = express();
const port = 8080;

//미들웨어
app.use(express.json());

//라우터
app.use('/', indexRouter);

//서버 시작
app.listen(port);