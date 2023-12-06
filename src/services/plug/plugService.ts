import Plugs from '../../models/plugs';
import Pins from '../../models/pins';
import PlugLogs from '../../models/plugLogs';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import HttpError from '../../helpers/httpError';
import PlugOffLogs from '../../models/plugOffLogs';
import {mqttClient} from '../../config/mqtt';

interface IToggleMqtt {
  toggle: string;
}

class PlugService {
  async newPlug() {
    const lastPlug = await Plugs.findOne().sort({ plugId: -1 });
    const plugId = lastPlug ? lastPlug.plugId + 1 : 1;

    const plug = new Plugs({
      plugId: plugId,
      topic: `plug_${plugId}`,
      isConnected: false,
      plugName: `plug_${plugId}`,
      plugDescription: ' ',
      useStatus: false
    });
    await plug.save();

    return {
      plugId: plug.plugId,
      topic: plug.topic,
      isConnected: plug.isConnected,
      plugName: plug.plugName
    };
  }

  async connectPlug(topic: string, cafeId: number) {
    const findPlug = await Plugs.findOne({ topic: topic });

    if (!findPlug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    }

    findPlug.isConnected = true;
    findPlug.cafeId = cafeId;
    await findPlug.save();

    return;
  }

  async getPlugInfo(plugId: number) {
    const plug = await Plugs.findOne({ plugId: plugId });

    if (!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    }
    if (!plug.isConnected) {
      throw new HttpError(BaseResponseStatus.NOT_CONNECTED_PLUG);
    }

    const usePlugLog = await PlugLogs.findOne({ plugId: plug.plugId, useStatus: true });

    let startHours = 0;
    let startMinutes = 0;
    let runningHours = 0;
    let runningMinutes = 0;

    let assignPower = 0.0;
    let usedPower = 0.0;
    let realTimePower = 0.0;

    let toggle = false;

    if (usePlugLog) {
      startHours = usePlugLog.startTime.getHours();
      startMinutes = usePlugLog.startTime.getMinutes();

      const nowDate = new Date();
      const timeDiff = nowDate.getTime() - usePlugLog.startTime.getTime();
      const timeDiffMinute = Math.floor(timeDiff / (1000 * 60));

      runningHours = Math.floor(timeDiffMinute / 60);
      runningMinutes = timeDiffMinute % 60;

      assignPower = 5.0;
      usedPower = 3.0;
      realTimePower = 1.0;

      //mqtt 연결해서 toggle 얻기
    }

    return {
      'plugId': plug.plugId,
      'topic': plug.topic,
      'cafeId': plug.cafeId,
      'subGroup': plug.subGroup,
      'plugName': plug.plugName,
      'plugDescription': plug.plugDescription,
      'useStatus': plug.useStatus,
      'startTime': {
        'hours': startHours,
        'minutes': startMinutes
      },
      "runningTime": {
        'hours': runningHours,
        'minutes': runningMinutes
      },
      'assignPower': assignPower,
      'usedPower': usedPower,
      'realTimePower': realTimePower,
      'toggle': toggle
    };
  }

  async togglePlug(plugId: number, toggle: boolean) {
    const plug = await Plugs.findOne({ plugId: plugId });

    if(!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    } else if(!plug.isConnected) {
      throw new HttpError(BaseResponseStatus.NOT_CONNECTED_PLUG);
    }

    const commandTopic = `cmnd/${plug.topic}/PlugToggle`;
    const commandMessage = toggle ? '0' : '1';
    const resultTopic = `stat/${plug.topic}/RESULT`;

    const result = await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        mqttClient.unsubscribe(resultTopic);
        reject(new HttpError(BaseResponseStatus.OFFLINE_PLUG));
      }, 5000);

      mqttClient.publish(commandTopic, commandMessage, () => {
        mqttClient.subscribe(resultTopic);

        mqttClient.on('message', (topic: string, message: Buffer) => {
          if(topic == resultTopic) {
            mqttClient.unsubscribe(resultTopic);
            clearTimeout(timeout);
            resolve(JSON.parse(message.toString()));
          }
        });
      });
    });

    return result;
  }

  async usePlug(plugId: number, pinNumber: number) {
    const plug = await Plugs.findOne({ plugId: plugId });
    if (!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    }
    if (plug.useStatus) {
      throw new HttpError(BaseResponseStatus.USED_PLUG);
    }

    const pin = await Pins.findOne({ pinNumber: pinNumber, cafeId: plug.cafeId, validStatus: true });
    if(!pin) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PIN);
    }
    pin.validStatus = false;
    await pin.save();

    const nowDate = new Date();
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    if (pin.issueTime.getTime() < oneHourAgo.getTime()) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PIN);
    }

    plug.useStatus = true;
    await plug.save();

    const lastPlugLog = await PlugLogs.findOne().sort({ plugUseId: -1 });
    const plugUseId = lastPlugLog ? lastPlugLog.plugUseId + 1 : 1;

    const plugLog = new PlugLogs({
      plugUseId: plugUseId,
      plugId: plug.plugId,
      plugName: plug.plugName,
      cafeId: plug.cafeId,
      useStatus: true,
      startTime: nowDate,
      assignPower: 0,
      usedPower: 0
    });
    await plugLog.save();

    return;
  }

  async stopPlug(plugId: number) {
    const plug = await Plugs.findOne({ plugId: plugId });

    if(!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    } else if(!plug.useStatus) {
      throw new HttpError(BaseResponseStatus.NOT_USED_PLUG);
    }
    plug.useStatus = false;
    await plug.save();

    const plugLog = await PlugLogs.findOne({ plugId: plugId, useStatus: true });
    if(!plugLog) {
      throw new HttpError(BaseResponseStatus.IMPOSSIBLE_ERROR);
    }

    plugLog.useStatus = false;
    plugLog.endTime = new Date();
    //usedPower 한번 갱신 하면 좋을듯
    await plugLog.save();

    return;
  }

  async getPlugBlockingLog(plugId: number) {
    const plugOffLog = await PlugOffLogs.find({ plugId: plugId, type: 'Blocking' }).sort({ plugOffTime: -1 }).limit(100);
    const result = [];

    for(let i = 0; i < plugOffLog.length; i++) {
      const plugLog = plugOffLog[i];
      const log = {
        plugId: plugLog.plugId,
        plugName: plugLog.plugName,
        type: plugLog.type,
        plugOffTime: {
          'date': {
            'year': plugLog.plugOffTime.getFullYear(),
            'month': plugLog.plugOffTime.getMonth() + 1,
            'day': plugLog.plugOffTime.getDate()
          },
          'time': {
            'hours': plugLog.plugOffTime.getHours(),
            'minutes': plugLog.plugOffTime.getMinutes()
          }
        },
        ownerCheck: plugLog.ownerCheck,
        isToggleOn: plugLog.isToggleOn
      };
      result.push(log);
    }

    return result;
  }

  async getPlugOffLog(plugId: number) {
    const result = [];
    const lastPlugLog = await PlugLogs.findOne({ plugId: plugId }).sort({ plugUseId: -1 });

    if(lastPlugLog && lastPlugLog.useStatus) {
      const plugUseId = lastPlugLog.plugUseId;
      const plugOffLogs = await PlugOffLogs.find({ plugUseId: plugUseId }).sort({ plugOffTime: -1 });

      for(let i = 0; i < plugOffLogs.length; i++) {
        const plugLog = plugOffLogs[i];
        const log = {
          plugId: plugLog.plugId,
          plugName: plugLog.plugName,
          type: plugLog.type,
          plugOffTime: {
            'date': {
              'year': plugLog.plugOffTime.getFullYear(),
              'month': plugLog.plugOffTime.getMonth() + 1,
              'day': plugLog.plugOffTime.getDate()
            },
            'time': {
              'hours': plugLog.plugOffTime.getHours(),
              'minutes': plugLog.plugOffTime.getMinutes()
            }
          },
          ownerCheck: plugLog.ownerCheck,
          isToggleOn: plugLog.isToggleOn
        };
        result.push(log);
      }
    }

    return result;
  }
}

export default new PlugService();
