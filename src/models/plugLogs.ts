import { Document, Schema, model } from 'mongoose';

interface IPlugLog extends Document {
  plugUseId: number;
  plugId: number;
  plugName: string;
  cafeId: number;
  userId: number;
  useStatus: boolean;
  startTime: Date;
  endTime: Date;
  assignPower: number;
  usedPower: number;
}

const plugLogScheme: Schema = new Schema<IPlugLog>({
  plugUseId: { type: Number, required: true, unique: true },
  plugId: { type: Number, required: true },
  plugName: { type: String, required: true },
  cafeId: { type: Number, required: true },
  userId: { type: Number },
  useStatus: { type: Boolean, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  assignPower: { type: Number, required: true },
  usedPower: { type: Number, required: true }
});

const PlugLogs = model<IPlugLog>('plugLogs', plugLogScheme);

export default PlugLogs;
