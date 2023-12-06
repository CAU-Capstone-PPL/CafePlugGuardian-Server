import { Document, Schema, model } from 'mongoose';

interface IMileageMenu extends Document {
  menuId: number;
  cafeId: number;
  isDeleted: boolean;
  menuName: string;
  menuPrice: number;
  menuDescription: string;
}

const mileageMenuScheme: Schema = new Schema<IMileageMenu>({
  menuId: { type: Number, required: true },
  cafeId: { type: Number, required: true },
  isDeleted: { type: Boolean, required: true },
  menuName: { type: String, required: true },
  menuPrice: { type: Number, required: true },
  menuDescription: { type: String, required: true }
});

const MileageMenus = model<IMileageMenu>('mileageMenu', mileageMenuScheme);

export default MileageMenus;
