import { Document, Schema, model } from 'mongoose';

interface ICafe extends Document {
  userId: string;
  cafeId: number;
  cafeName: string;
}

const cafeScheme: Schema = new Schema<ICafe>({
  userId: { type: String, required: true },
  cafeId: { type: Number, required: true },
  cafeName: { type: String, required: true }
});

const cafes = model<ICafe>('cafes', cafeScheme);

export default cafes;
