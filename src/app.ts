import configureEnvironment from './config/environment';
import connectDatabase from './config/database';
import { connectMQTTBroker } from './config/mqtt';
import configureExpressApp from './config/expressApp';

configureEnvironment();
connectDatabase();
connectMQTTBroker();

const PORT = process.env.PORT || 80;
const server = configureExpressApp();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/* https 실행 코드
const PORT = process.env.PORT || 443;
const httpsServer = configureHTTPS();

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
*/
