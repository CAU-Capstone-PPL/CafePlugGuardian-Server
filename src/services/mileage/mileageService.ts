import UserMileages from '../../models/userMileages';

class MileageService {
  async getMileage(userId: number, cafeId: number) {
    let mileageData = await UserMileages.findOne({ userId: userId, cafeId: cafeId });

    if(!mileageData) {
      const mileage = new UserMileages({
        userId: userId,
        cafeId: cafeId,
        mileage: 0
      });
      await mileage.save();
      mileageData = mileage;
    }

    return {
      userId: mileageData.userId,
      cafeId: mileageData.cafeId,
      mileage: mileageData.mileage
    };
  }
}

export default new MileageService();
