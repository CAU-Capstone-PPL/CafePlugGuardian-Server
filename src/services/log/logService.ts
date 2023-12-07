import PlugOffLogs from '../../models/plugOffLogs';
import HttpError from '../../helpers/httpError';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';

class LogService {
  async checkManagerLog(plugOffLogId: number, option: number) {
    const plugOffLog = await PlugOffLogs.findOne({ plugOffLogId: plugOffLogId });
    if(!plugOffLog) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG_OFF_LOG);
    }

    if(option == 0) {
      plugOffLog.ownerCheck = true;
    } else if(option == 1) {
      plugOffLog.isToggleOn = true;
    }
    await plugOffLog.save();

    return;
  }
}

export default new LogService();
