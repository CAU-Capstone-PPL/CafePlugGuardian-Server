import { Document, Schema, model } from 'mongoose';

interface IPlug extends Document {
  plugId: number;
  topic: string;
  cafeId: number;
  subGroup: string;
  plugName: string;
}

const plugScheme: Schema = new Schema<IPlug>({
  plugId: { type: Number, required: true, unique: true },
  topic: { type: String, required: true, unique: true },
  cafeId: { type: Number },
  subGroup: { type: String },
  plugName: { type: String }
});

const Plugs = model<IPlug>('plugs', plugScheme);

export default Plugs;
