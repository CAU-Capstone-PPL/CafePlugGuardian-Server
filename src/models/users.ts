import { Document, Schema, model } from 'mongoose';

interface IUser extends Document {
  userId: string;
  userPw: string;
  userName: string;
}

const userScheme: Schema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  userPw: { type: String, required: true },
  userName: { type: String, required: true },
});

const users = model<IUser>('users', userScheme);

export default users;
