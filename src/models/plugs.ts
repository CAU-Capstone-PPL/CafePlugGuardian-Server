import { Document, Schema, model } from 'mongoose';

interface IPlug extends Document {
  plugId: number;
  cafeId: number;
}

const plugScheme: Schema = new Schema<IPlug>({
  plugId: { type: Number, required: true, unique: true },
  cafeId: { type: Number, required: true }
});

const plugs = model<IPlug>('plugs', plugScheme);

export default plugs;
