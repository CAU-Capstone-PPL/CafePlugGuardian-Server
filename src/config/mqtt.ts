import {connect, MqttClient} from 'mqtt';

let mqttClient: MqttClient;

interface Sample {
  sample: number;
}

interface Json {
  current: Sample[];
}

function connectMQTTBroker() {
  const mqttBrokerUrl: string | undefined = process.env.MQTT_URL;

  if (!mqttBrokerUrl) {
    console.error('MQTT_URL not defined in .env file');
    process.exit(1);
  }
  mqttClient = connect(mqttBrokerUrl);

  mqttClient.on('connect', () => {
    console.log('MQTT Broker에 연결되었습니다.');
    mqttClient.subscribe('+/tasmota_9A3FB8/+');
    //mqttClient.subscribe('+/tasmota_6369CC/+');
  });

  mqttClient.on('message', (topic: string, message: Buffer) => {
    console.log(`mqtt 테스트 ${topic}: ${message.toString()}`);

    try {
      const json: Json = JSON.parse(message.toString());
      const current = json['current'];
    } catch (e) {
    }
  });
}

export { mqttClient, connectMQTTBroker };
