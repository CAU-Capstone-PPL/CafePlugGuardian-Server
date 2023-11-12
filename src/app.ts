import configureEnvironment from './config/environment';
import connectDatabase from './config/database';
import configureHTTPS from './config/https';
import connectMQTTBroker from "./config/mqtt";

configureEnvironment();
connectDatabase();
connectMQTTBroker();

const PORT = process.env.PORT || 443;
const httpsServer = configureHTTPS();

httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
