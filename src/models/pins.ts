import { Document, Schema, model } from 'mongoose';

interface IPin extends Document {
  pinNumber: number;
  cafeId: number;
  issueTime: Date;
  validCount: number;
}

const pinScheme: Schema = new Schema<IPin>({
  pinNumber: { type: Number, required: true },
  cafeId: { type: Number, required: true },
  issueTime: { type: Date, required: true },
  validCount: { type: Number, required: true }
});

const Pins = model<IPin>('pins', pinScheme);

export default Pins;
