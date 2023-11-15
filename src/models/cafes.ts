import { Document, Schema, model } from 'mongoose';

interface ICafe extends Document {
  userId: number;
  cafeId: number;
  cafeName: string;
}

const cafeScheme: Schema = new Schema<ICafe>({
  userId: { type: Number, required: true },
  cafeId: { type: Number, required: true },
  cafeName: { type: String, required: true }
});

const Cafes = model<ICafe>('cafes', cafeScheme);

export default Cafes;
