import { Schema, model, Model } from 'mongoose';

interface IUser {
  userId: string;
  password: string;
  userName: string;
}

interface IUserModel extends Model<IUser> {}

const userScheme = new Schema<IUser, IUserModel>({
  userId: { type: String, required: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
});

const User = model<IUser, IUserModel>('User', userScheme);

export { User };
