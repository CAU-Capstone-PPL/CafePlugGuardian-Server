import { Document, Schema, model } from 'mongoose';

interface IPlug extends Document {
  plugId: number;
  topic: string;
  isConnected: boolean;
  cafeId: number;
  subGroup: string;
  plugName: string;
  plugDescription: string;
  useStatus: boolean;
}

const plugScheme: Schema = new Schema<IPlug>({
  plugId: { type: Number, required: true, unique: true },
  topic: { type: String, required: true, unique: true },
  isConnected: { type: Boolean, required: true },
  cafeId: { type: Number },
  subGroup: { type: String },
  plugName: { type: String, required: true },
  plugDescription: { type: String, required: true },
  useStatus: { type: Boolean, required: true }
});

const Plugs = model<IPlug>('plugs', plugScheme);

export default Plugs;
