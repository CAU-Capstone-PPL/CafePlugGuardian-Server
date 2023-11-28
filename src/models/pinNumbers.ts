import { Document, Schema, model } from 'mongoose';

interface IPinNumber extends Document {
  pinNumber: number;
  cafeId: number;
  issueTime: Date;
  validStatus: boolean;
}

const pinNumberScheme: Schema = new Schema<IPinNumber>({
  pinNumber: { type: Number, required: true },
  cafeId: { type: Number, required: true },
  issueTime: { type: Date, required: true },
  validStatus: { type: Boolean, required: true }
});

const PinNumbers = model<IPinNumber>('pinNumbers', pinNumberScheme);

export default PinNumbers;
