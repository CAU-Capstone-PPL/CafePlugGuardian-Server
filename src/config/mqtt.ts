import {connect, MqttClient} from 'mqtt';

let mqttClient: MqttClient;

function connectMQTTBroker() {
  const mqttBrokerUrl: string | undefined = process.env.MQTT_URL;

  if (!mqttBrokerUrl) {
    console.error('MQTT_URL not defined in .env file');
    process.exit(1);
  }
  mqttClient = connect(mqttBrokerUrl);

  mqttClient.on('connect', () => {
    console.log('MQTT Broker에 연결되었습니다.');
    mqttClient.subscribe('+/tasmota_A786D3/+');
  });

  mqttClient.on('message', (topic: string, message: Buffer) => {
    console.log(`Received message on topic ${topic}: ${message.toString()}`);
  });
}

export { mqttClient, connectMQTTBroker };
