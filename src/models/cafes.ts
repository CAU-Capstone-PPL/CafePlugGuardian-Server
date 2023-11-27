import { Document, Schema, model } from 'mongoose';

interface ICafe extends Document {
  cafeId: number;
  userId: number;
  cafeName: string;
}

const cafeScheme: Schema = new Schema<ICafe>({
  cafeId: { type: Number, required: true, unique: true },
  userId: { type: Number, required: true },
  cafeName: { type: String, required: true }
});

const Cafes = model<ICafe>('cafes', cafeScheme);

export default Cafes;
