import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import https from "https";
import indexRouter from './routes/index/index';

const environment: string = process.env.NODE_ENV || 'development';

if (environment === 'production') {
  dotenv.config({ path: 'src/config/.env.production.local' });
} else if (environment === 'development') {
  dotenv.config({ path: 'src/config/.env.development.local' });
} else if (environment === 'test') {
  dotenv.config({ path: 'src/config/.env.test.local' });
}

const privateKeyPath: string | undefined = process.env.PRIVATE_KEY_PATH;
const certificatePath: string | undefined = process.env.CERTIFICATE_PATH;

if (!privateKeyPath || !certificatePath) {
  console.error('PRIVATE_KEY_PATH or CERTIFICATE_PATH not defined in .env file');
  process.exit(1);
}

const app = express();
const options = {
  key: fs.readFileSync(privateKeyPath),
  cert: fs.readFileSync(certificatePath)
};
const port = 8080;
const server = https.createServer(options, app);

//미들웨어
app.use(express.json());

//라우터
app.use('/', indexRouter);

//서버 시작
server.listen(port);