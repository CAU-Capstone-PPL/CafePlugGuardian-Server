import plugs from '../../models/plugs';
import response from '../../helpers/response';
import BaseResponseStatus from '../../helpers/baseResponseStatus';

class PlugService {
  async newPlug() {
    const lastPlug = await plugs.findOne().sort({ plugId: -1 });
    let plugId;

    if (lastPlug) {
      plugId = lastPlug.plugId + 1;
    } else {
      plugId = 1;
    }

    const plug = new plugs({
      plugId: plugId,
      topic: `plug_${plugId}`
    });
    await plug.save();

    return response(BaseResponseStatus.SUCCESS, plug);
  }

  async getPlugInfo(plugId: number) {
    const plug = await plugs.findOne({ plugId: plugId });

    if (!plug) {
      return response(BaseResponseStatus.ERROR);
    }

    const plugInfo = {
      'plugId': plugId,
      'plugName': plug.plugName,
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
