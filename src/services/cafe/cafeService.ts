import Cafes from '../../models/cafes';
import Plugs from '../../models/plugs';
import response from '../../helpers/response';
import BaseResponseStatus from '../../helpers/baseResponseStatus';

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

    return response(BaseResponseStatus.SUCCESS);
  }

  async getCafeList(userId: number) {
    const cafeList = await Cafes.find({ userId: userId });

    return response(BaseResponseStatus.SUCCESS, cafeList);
  }

  async getPlugList(cafeId: number) {
    const plugList = await Plugs.find({ cafeId: cafeId });
    const result = [];

    for (let i = 0; i < plugList.length; i++) {
      const plug = {
        'plugId': plugList[i].plugId,
        'plugName': plugList[i].plugName,
        'onOff': 'On',
        'runningTime': 'dummy',
        'usedPower': 0,
        'assignPower': 0
      };
      result.push(plug);
    }

    return response(BaseResponseStatus.SUCCESS, result);
  }
}

export default new CafeService();
