import {connect, MqttClient} from 'mqtt';
import Plugs from '../models/plugs';
import axios, {AxiosError, AxiosResponse} from 'axios';
import PlugLogs from '../models/plugLogs';

let mqttClient: MqttClient;
const topicPattern = /^stat\/([^\/]+)\/RESULT$/;

function connectMQTTBroker() {
  const mqttBrokerUrl: string | undefined = process.env.MQTT_URL;

  if (!mqttBrokerUrl) {
    console.error('MQTT_URL not defined in .env file');
    process.exit(1);
  }
  mqttClient = connect(mqttBrokerUrl);

  mqttClient.on('connect', async () => {
    const plugs = await Plugs.find({ isConnected: true });
    for(let i = 0; i < plugs.length; i++) {
      mqttClient.subscribe(`+/${plugs[i].topic}/+`);
    }

    console.log('MQTT Broker에 연결되었습니다.');
    //mqttClient.subscribe('+/tasmota_9A3FB8/+');
    //mqttClient.subscribe('+/tasmota_6369CC/+');
  });

  mqttClient.on('message', async (topic: string, message: Buffer) => {
    console.log(`mqtt 테스트 ${topic}: ${message.toString()}`);

    const match = topic.match(topicPattern);
    if(match) {
      const device_topic = match[1];

      try {
        const jsonData = JSON.parse(message.toString());

        if('current' in jsonData) {
          const plugLog = await PlugLogs.findOne({ topic: device_topic, useStatus: true });
          if(plugLog) {
            if(jsonData.current >= 0.15) {
              if(!plugLog.isCheckPermit) {
                plugLog.isCheckPermit = true;
                plugLog.save();
                mqttClient.publish(`cmnd/${device_topic}/SamplingCurrent`, '0');
              }
            } else if(jsonData.current < 0.15) {
              plugLog.isCheckPermit = false;
              plugLog.save();
            }
          }
        }

        if('current_sampling' in jsonData) {
          const sample = {
            current: jsonData['current_sampling']
          };

          const AIServerURL = process.env.AI_SERVER_URL;
          if(AIServerURL) {
            axios.post(AIServerURL, sample)
              .then((response: AxiosResponse) => {
                console.log(response.data);
              })
              .catch((error: AxiosError) => {
                console.log('AI SERVER ERROR');
              });
          }
        }
      } catch(e) {
      }
    }
  });
}

export { mqttClient, connectMQTTBroker };
