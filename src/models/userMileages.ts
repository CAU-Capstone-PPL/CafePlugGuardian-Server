import { Document, Schema, model } from 'mongoose';

interface IUserMileage extends Document {
  userId: number;
  cafeId: number;
  mileage: number;
}

const userMileageScheme: Schema = new Schema<IUserMileage>({
  userId: { type: Number, required: true },
  cafeId: { type: Number, required: true },
  mileage: { type: Number, required: true }
});

const UserMileages = model<IUserMileage>('userMileages', userMileageScheme);

export default UserMileages;
