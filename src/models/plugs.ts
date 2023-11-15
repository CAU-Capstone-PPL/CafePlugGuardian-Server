import { Document, Schema, model } from 'mongoose';

interface IPlug extends Document {
  plugId: number;
  topic: string;
  plugName: string;
  userId: number;
  cafeId: number;
  subGroup: string;
}

const plugScheme: Schema = new Schema<IPlug>({
  plugId: { type: Number, required: true, unique: true },
  topic: { type: String, required: true, unique: true },
  plugName: { type: String, required: true },
  userId: { type: Number },
  cafeId: { type: Number },
  subGroup: { type: String }
});

const Plugs = model<IPlug>('plugs', plugScheme);

export default Plugs;
