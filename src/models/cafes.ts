import { Document, Schema, model } from 'mongoose';

interface ICafe extends Document {
  cafeId: number;
  cafeName: string;
  userId: string;
}

const cafeScheme: Schema = new Schema<ICafe>({
  cafeId: { type: Number, required: true, unique: true },
  cafeName: { type: String, required: true },
  userId: { type: String, required: true }
});

const cafes = model<ICafe>('cafes', cafeScheme);

export default cafes;
