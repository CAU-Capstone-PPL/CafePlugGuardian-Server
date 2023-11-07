import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
  userId: string;
  password: string;
  userName: string;
}

const userScheme: Schema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userName: { type: String, required: true },
});

const User = model<IUser>('User', userScheme);

export default User;
