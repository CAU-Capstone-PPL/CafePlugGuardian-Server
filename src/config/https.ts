import fs from "fs";
import https from "https";
import configureExpressApp from "./expressApp";

function configureHTTPS() {
  const privateKeyPath: string | undefined = process.env.PRIVATE_KEY_PATH;
  const certificatePath: string | undefined = process.env.CERTIFICATE_PATH;

  if (!privateKeyPath || !certificatePath) {
    console.error('PRIVATE_KEY_PATH or CERTIFICATE_PATH not defined in .env file');
    process.exit(1);
  }

  const options = {
    key: fs.readFileSync(privateKeyPath),
    cert: fs.readFileSync(certificatePath)
  };

  const app = configureExpressApp();
  return https.createServer(options, app)
}

export default configureHTTPS;