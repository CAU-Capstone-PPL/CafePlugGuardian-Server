import Cafes from '../../models/cafes';
import Plugs from '../../models/plugs';
import Pins from '../../models/pins';
import plugService from '../plug/plugService';
import PlugOffLogs from '../../models/plugOffLogs';

class CafeService {
  async addCafe(userId: number, cafeName: string) {
    const lastCafe = await Cafes.findOne().sort({ cafeId: -1 });
    const cafeId = lastCafe ? lastCafe.cafeId + 1 : 1;

    const cafe = new Cafes({
      cafeId: cafeId,
      userId: userId,
      cafeName: cafeName
    });
    await cafe.save();

    return;
  }

  async getCafeList(userId: number) {
    const cafeList = await Cafes.find({ userId: userId });
    const result = [];

    for (let i = 0; i < cafeList.length; i++) {
      const cafe = {
        cafeIndex: i + 1,
        cafeId: cafeList[i].cafeId,
        cafeName: cafeList[i].cafeName
      }
      result.push(cafe);
    }

    return result;
  }

  async getPlugList(cafeId: number) {
    const plugList = await Plugs.find({ cafeId: cafeId });
    const result = [];

    for (let i = 0; i < plugList.length; i++) {
      const plugInfo = await plugService.getPlugInfo(plugList[i].plugId);
      result.push(plugInfo);
    }

    return result;
  }

  generateRandomPinNumber() {
    return Math.floor(1000 + Math.random() * 9000);
  }

  async getPinNumber(cafeId: number) {
    const nowDate = new Date();
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    await Pins.updateMany(
      { issueTime: { $lt: oneHourAgo }, validStatus: true },
      { $set: { validStatus: false } }
    );

    let pinNumber: number;
    while (true) {
      pinNumber = this.generateRandomPinNumber();
      if (!(await Pins.findOne({ pinNumber: pinNumber, cafeId: cafeId, validStatus: true }))) {
        break;
      }
    }

    const pin = new Pins({
      pinNumber: pinNumber,
      cafeId: cafeId,
      issueTime: nowDate,
      validStatus: true
    });
    await pin.save();

    const result = {
      'pinNumber': pinNumber,
      'issueTime': {
        'date': {
          'year': nowDate.getFullYear(),
          'month': nowDate.getMonth() + 1,
          'day': nowDate.getDate()
        },
        'time': {
          'hours': nowDate.getHours(),
          'minutes': nowDate.getMinutes()
        }
      }
    };

    return result;
  }

  async getCafePlugBlockingLog(cafeId: number) {
    const cafePlugOffLog = await PlugOffLogs.find({ cafeId: cafeId, type: 'Blocking' }).sort({ plugOffTime: -1 }).limit(100);
    const result = [];

    for(let i = 0; i < cafePlugOffLog.length; i++) {
      const plugLog = cafePlugOffLog[i];
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
}

export default new CafeService();
