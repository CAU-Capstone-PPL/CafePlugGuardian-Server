import cafes from '../../../models/cafes';
import response from '../../../helpers/response';
import BaseResponseStatus from '../../../helpers/baseResponseStatus';

class CafeService {
  async addCafe(userId: number, cafeName: string) {
    const lastCafe = await cafes.findOne({ userId }).sort({ cafeId: -1});
    const cafeId = lastCafe ? lastCafe.cafeId + 1 : 1;

    const cafe = new cafes({
      userId: userId,
      cafeId: cafeId,
      cafeName: cafeName
    });
    await cafe.save();

    return response(BaseResponseStatus.SUCCESS);
  }

  async getCafeList(userId: number) {
    const cafeList = await cafes.find({ userId: userId });

    return response(BaseResponseStatus.SUCCESS, cafeList);
  }
}

export default new CafeService();