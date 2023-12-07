import Plugs from '../../models/plugs';
import Pins from '../../models/pins';
import PlugLogs from '../../models/plugLogs';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import HttpError from '../../helpers/httpError';
import PlugOffLogs from '../../models/plugOffLogs';
import {mqttClient} from '../../config/mqtt';

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

      assignPower = usePlugLog.assignPower;
      usedPower = usePlugLog.usedPower;

      const commandTopic = `cmnd/${plug.topic}/CafePlugStatus`;
      const commandMessage = '0';
      const resultTopic = `stat/${plug.topic}/RESULT`;

      const response = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          mqttClient.unsubscribe(resultTopic);
          reject(new HttpError(BaseResponseStatus.OFFLINE_PLUG));
        }, 5000);

        mqttClient.publish(commandTopic, commandMessage, () => {
          mqttClient.subscribe(resultTopic);

          mqttClient.on('message', (topic: string, message: Buffer) => {
            if(topic == resultTopic) {
              const jsonData = JSON.parse(message.toString());
              if('power' in jsonData) {
                toggle = jsonData['toggle'] == 1;
                realTimePower = jsonData['power'];
                mqttClient.unsubscribe(resultTopic);
                clearTimeout(timeout);
                resolve(JSON.parse(message.toString()));
              }
            }
          });
        });
      });
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
    const commandMessage = toggle ? '1' : '0';
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
            const jsonData = JSON.parse(message.toString());
            if('toggle' in jsonData) {
              mqttClient.unsubscribe(resultTopic);
              clearTimeout(timeout);
              resolve(JSON.parse(message.toString()));
            }
          }
        });
      });
    });

    const plugLog = await PlugLogs.findOne({ plugId: plugId, useStatus: true });
    if(plugLog) {
      plugLog.isCheckPermit = !toggle;
      await plugLog.save();
    }

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

    const pin = await Pins.findOne({ pinNumber: pinNumber, cafeId: plug.cafeId, validCount: { $gt: 0 } });
    if(!pin) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PIN);
    }

    const nowDate = new Date();
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    if (pin.issueTime.getTime() < oneHourAgo.getTime()) {
      pin.validCount = 0;
      await pin.save();
      throw new HttpError(BaseResponseStatus.UNKNOWN_PIN);
    }

    pin.validCount -= 1;
    await pin.save();

    await this.togglePlug(plugId, true);

    plug.useStatus = true;
    await plug.save();

    const lastPlugLog = await PlugLogs.findOne().sort({ plugUseId: -1 });
    const plugUseId = lastPlugLog ? lastPlugLog.plugUseId + 1 : 1;

    const plugLog = new PlugLogs({
      plugUseId: plugUseId,
      plugId: plug.plugId,
      topic: plug.topic,
      plugName: plug.plugName,
      cafeId: plug.cafeId,
      useStatus: plug.useStatus,
      startTime: nowDate,
      assignPower: 50,
      usedPower: 0,
      isCheckPermit: false
    });
    await plugLog.save();

    return;
  }

  async extendUsePlug(plugId: number, pinNumber: number) {
    const plug = await Plugs.findOne({ plugId: plugId });
    if (!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    }

    const pin = await Pins.findOne({ pinNumber: pinNumber, cafeId: plug.cafeId, validCount: { $gt: 0 } });
    if(!pin) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PIN);
    }

    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    if (pin.issueTime.getTime() < oneHourAgo.getTime()) {
      pin.validCount = 0;
      await pin.save();
      throw new HttpError(BaseResponseStatus.UNKNOWN_PIN);
    }

    const plugLog = await PlugLogs.findOne({ plugId: plugId, useStatus: true });
    if(!plugLog) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG_LOG);
    }
    plugLog.assignPower += 50;
    await plugLog.save();

    pin.validCount--;
    await pin.save();

    return;
  }

  async stopPlug(plugId: number) {
    const plug = await Plugs.findOne({ plugId: plugId });

    if(!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    } else if(!plug.useStatus) {
      throw new HttpError(BaseResponseStatus.NOT_USED_PLUG);
    }
    await this.togglePlug(plugId, false);

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

  async blockingPlug(plugUseId: number, blockingType: string) {
    const plugLog = await PlugLogs.findOne({ plugUseId: plugUseId });
    if(!plugLog) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG_LOG);
    }

    const lastBlockingLog = await PlugOffLogs.findOne().sort({ plugOffLogId: -1 });
    const plugOffLogId = lastBlockingLog ? lastBlockingLog.plugOffLogId + 1 : 1;

    await this.togglePlug(plugLog.plugId, false);
    const nowDate = new Date();

    const plugOffLog = new PlugOffLogs({
      plugOffLogId: plugOffLogId,
      plugUseId: plugUseId,
      plugId: plugLog.plugId,
      plugName: plugLog.plugName,
      type: blockingType,
      plugOffTime: nowDate,
      ownerCheck: false,
      isToggleOn: false
    });
    await plugOffLog.save();

    return;
  }

  async getPlugBlockingLog(plugId: number) {
    const plugOffLogs = await PlugOffLogs.find({ plugId: plugId, type: 'Blocking' }).sort({ plugOffTime: -1 }).limit(100);
    const result = [];

    for(let i = 0; i < plugOffLogs.length; i++) {
      const plugOffLog = plugOffLogs[i];
      const log = {
        plugOffLogId: plugOffLog.plugOffLogId,
        plugUseId: plugOffLog.plugUseId,
        plugId: plugOffLog.plugId,
        plugName: plugOffLog.plugName,
        type: plugOffLog.type,
        plugOffTime: {
          'date': {
            'year': plugOffLog.plugOffTime.getFullYear(),
            'month': plugOffLog.plugOffTime.getMonth() + 1,
            'day': plugOffLog.plugOffTime.getDate()
          },
          'time': {
            'hours': plugOffLog.plugOffTime.getHours(),
            'minutes': plugOffLog.plugOffTime.getMinutes()
          }
        },
        ownerCheck: plugOffLog.ownerCheck,
        isToggleOn: plugOffLog.isToggleOn
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
        const plugOffLog = plugOffLogs[i];
        const log = {
          plugOffLogId: plugOffLog.plugOffLogId,
          plugUseId: plugOffLog.plugUseId,
          plugId: plugOffLog.plugId,
          plugName: plugOffLog.plugName,
          type: plugOffLog.type,
          plugOffTime: {
            'date': {
              'year': plugOffLog.plugOffTime.getFullYear(),
              'month': plugOffLog.plugOffTime.getMonth() + 1,
              'day': plugOffLog.plugOffTime.getDate()
            },
            'time': {
              'hours': plugOffLog.plugOffTime.getHours(),
              'minutes': plugOffLog.plugOffTime.getMinutes()
            }
          },
          ownerCheck: plugOffLog.ownerCheck,
          isToggleOn: plugOffLog.isToggleOn
        };
        result.push(log);
      }
    }

    return result;
  }
}

export default new PlugService();
