import plugs from '../../models/plugs';
import response from '../../helpers/response';
import BaseResponseStatus from '../../helpers/baseResponseStatus';

class PlugService {
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
}

export default new PlugService();
