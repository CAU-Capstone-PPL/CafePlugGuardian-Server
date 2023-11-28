import { Document, Schema, model } from 'mongoose';

interface IPin extends Document {
  pinNumber: number;
  cafeId: number;
  issueTime: Date;
  validStatus: boolean;
}

const pinScheme: Schema = new Schema<IPin>({
  pinNumber: { type: Number, required: true },
  cafeId: { type: Number, required: true },
  issueTime: { type: Date, required: true },
  validStatus: { type: Boolean, required: true }
});

const Pins = model<IPin>('pins', pinScheme);

export default Pins;
