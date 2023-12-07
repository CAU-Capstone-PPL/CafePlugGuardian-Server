import UserMileages from '../../models/userMileages';
import HttpError from '../../helpers/httpError';
import {BaseResponseStatus} from '../../helpers/baseResponseStatus';
import Plugs from '../../models/plugs';
import MileageMenus from '../../models/mileageMenus';
import Cafes from '../../models/cafes';

class MileageService {
  async getMileage(userId: number, plugId: number) {
    const plug = await Plugs.findOne({ plugId: plugId });
    if(!plug) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
    } else if(!plug.isConnected) {
      throw new HttpError(BaseResponseStatus.NOT_CONNECTED_PLUG);
    }
    const cafeId = plug.cafeId;

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

  async modifyMileage(userId: number, cafeId: number, mileage: number) {
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

    if(mileageData.mileage + mileage < 0) {
      throw new HttpError(BaseResponseStatus.NOT_ENOUGH_MILEAGE);
    }
    mileageData.mileage += mileage;
    await mileageData.save();

    return;
  }

  async getMenu(cafeId: number, plugId: number) {
    const result = [];

    if(!cafeId) {
      if(!plugId) {
        throw new HttpError(BaseResponseStatus.REQUIRE_MENU_CONDITION);
      }
      const plug = await Plugs.findOne({ plugId: plugId });
      if(!plug) {
        throw new HttpError(BaseResponseStatus.UNKNOWN_PLUG);
      }
      cafeId = plug.cafeId;
    }

    const menus = await MileageMenus.find({ cafeId: cafeId, isDeleted: false });
    for(let i = 0; i < menus.length; i++) {
      const menu = menus[i];
      const menuResponse = {
        menuId: menu.menuId,
        menuName: menu.menuName,
        menuPrice: menu.menuPrice,
        menuDescription: menu.menuDescription
      }
      result.push(menuResponse);
    }

    return result;
  }

  async addMenu(cafeId: number, menuName: string, menuPrice: number, menuDescription: string) {
    const cafe = await Cafes.findOne({ cafeId: cafeId });
    if(!cafe) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_CAFE);
    }

    const lastMenu = await MileageMenus.findOne().sort({ menuId: -1 });
    const menuId = lastMenu ? lastMenu.menuId + 1 : 1;

    const menu = new MileageMenus({
      menuId: menuId,
      cafeId: cafeId,
      isDeleted: false,
      menuName: menuName,
      menuPrice: menuPrice,
      menuDescription: menuDescription
    });
    await menu.save();

    return;
  }

  async modifyMenu(menuId: number, menuName: string, menuPrice: number, menuDescription: string) {
    const menu = await MileageMenus.findOne({ menuId: menuId });
    if(!menu) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_MENU);
    }

    menu.menuName = menuName;
    menu.menuPrice = menuPrice;
    menu.menuDescription = menuDescription;
    await menu.save();

    return;
  }

  async deleteMenu(menuId: number) {
    const menu = await MileageMenus.findOne({ menuId: menuId });
    if(!menu) {
      throw new HttpError(BaseResponseStatus.UNKNOWN_MENU);
    }

    menu.isDeleted = true;
    await menu.save();

    return;
  }
}

export default new MileageService();
