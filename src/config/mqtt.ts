import { connect } from 'mqtt';

function connectMQTTBroker() {
  const mqttBrokerUrl: string | undefined = process.env.MQTT_URL;

  if (!mqttBrokerUrl) {
    console.error('MQTT_URL not defined in .env file');
    process.exit(1);
  }
  const mqttClient = connect(mqttBrokerUrl);

  mqttClient.on('connect', () => {
    console.log('MQTT Broker에 연결되었습니다.');
    mqttClient.subscribe('devices/+/data');
  });

  mqttClient.on('message', (topic: string, message: Buffer) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
  });
}

export default connectMQTTBroker;
