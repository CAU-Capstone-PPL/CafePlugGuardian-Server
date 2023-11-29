import Plugs from '../../models/plugs';
import Pins from '../../models/pins';
import PlugLogs from '../../models/plugLogs';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import HttpError from '../../helpers/httpError';

class PlugService {
  async newPlug() {
    const lastPlug = await Plugs.findOne().sort({ plugId: -1 });
    const plugId = lastPlug ? lastPlug.plugId + 1 : 1;

    const plug = new Plugs({
      plugId: plugId,
      topic: `plug_${plugId}`,
      isConnected: false,
      plugName: `plug_${plugId}`,
      useStatus: false
    });
    await plug.save();

    return plug;
  }

  async connectPlug(topic: string, cafeId: number) {
    const findPlug = await Plugs.findOne({ topic: topic });

    if (!findPlug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    }

    findPlug.isConnected = true;
    findPlug.cafeId = cafeId;
    await findPlug.save();

    return findPlug;
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
      runningHours = timeDiff / (1000 * 60 * 60);
      runningMinutes = timeDiff / (1000 * 60);

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
    //toggle true: turn on, false: turn off
    if (toggle) {
      //mqtt로 toggle on 하는 코드
    } else {
      //mqtt로 toggle off 하는 코드
    }
    return;
  }

  async usePlug(plugId: number, pinNumber: number) {
    const plug = await Plugs.findOne({ plugId: plugId });
    if (!plug) {
      throw new HttpError(BaseResponseStatus.ERROR);
    }

    const pin = await Pins.findOne({ pinNumber: pinNumber, cafeId: plug.cafeId, validStatus: true });
    if(!pin) {
      throw new HttpError(BaseResponseStatus.ERROR);
    }
    pin.validStatus = false;
    await pin.save();

    const nowDate = new Date();
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    if (pin.issueTime.getTime() < oneHourAgo.getTime()) {
      throw new HttpError(BaseResponseStatus.ERROR);
    }

    const plugLog = new PlugLogs({
      plugUseId: 0,
      plugId: plugId,
      cafeId: plug.plugId,
      useStatus: true,
      startTime: nowDate,
      assignPower: 0,
      usedPower: 0
    });
    await plugLog.save();

    return plugLog;
  }
}

export default new PlugService();
