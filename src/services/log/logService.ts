import PlugOffLogs from '../../models/plugOffLogs';
import HttpError from '../../helpers/httpError';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';

class LogService {
  async checkManagerLog(plugOffLogId: number) {
    const plugOffLog = await PlugOffLogs.findOne({ plugOffLogId: plugOffLogId });
    if(!plugOffLog) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG_OFF_LOG);
    }

    plugOffLog.ownerCheck = true;
    await plugOffLog.save();

    return;
  }
}

export default new LogService();
