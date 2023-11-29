import Plugs from '../../models/plugs';
import Pins from '../../models/pins';
import PlugLogs from '../../models/plugLogs';
import { BaseResponseStatus } from '../../helpers/baseResponseStatus';
import HttpError from '../../helpers/httpError';

class PlugService {
  async newPlug() {
    const lastPlug = await Plugs.findOne().sort({ plugId: -1 });
    const plugId = lastPlug ? lastPlug.plugId + 1 : 1;

    const plug = new Plugs({
      plugId: plugId,
      topic: `plug_${plugId}`,
      plugName: `plug_${plugId}`
    });
    await plug.save();

    return plug;
  }

  async connectPlug(topic: string, cafeId: number) {
    const findPlug = await Plugs.findOne({ topic: topic });

    if (!findPlug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    }

    findPlug.cafeId = cafeId;
    await findPlug.save();

    return findPlug;
  }

  async getPlugInfo(plugId: number) {
    const plug = await Plugs.findOne({ plugId: plugId });

    if (!plug) {
      throw new HttpError(BaseResponseStatus.ERROR);
    }

    const plugInfo = {
      'plugId': plugId,
      'topic': plug.topic,
      'plugName': plug.plugName,
      'cafeId': plug.cafeId,
      'subGroup': plug.subGroup,
      'onOff': 'dummy',
      'runningTime': 'dummy',
      'usedPower': 'dummy',
      'assignPower': 'dummy'
    };

    return plugInfo;
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
