import Plugs from '../../models/plugs';
import response from '../../helpers/response';
import BaseResponseStatus from '../../helpers/baseResponseStatus';

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

    return response(BaseResponseStatus.SUCCESS, plug);
  }

  async connectPlug(topic: string, cafeId: number) {
    const findPlug = await Plugs.findOne({ topic: topic });

    if (findPlug) {
      findPlug.cafeId = cafeId;
      await findPlug.save();

      return response(BaseResponseStatus.SUCCESS, findPlug);
    } else {
      return response(BaseResponseStatus.UNKNOWN_PLUG);
    }
  }

  async getPlugInfo(plugId: number) {
    const plug = await Plugs.findOne({ plugId: plugId });

    if (!plug) {
      return response(BaseResponseStatus.ERROR);
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
    return response(BaseResponseStatus.SUCCESS, plugInfo);
  }

  async togglePlug(plugId: number, toggle: boolean) {
    //toggle true: turn on, false: turn off
    if (toggle) {
      //mqtt로 toggle on 하는 코드
    } else {
      //mqtt로 toggle off 하는 코드
    }
    return response(BaseResponseStatus.SUCCESS);
  }
}

export default new PlugService();
