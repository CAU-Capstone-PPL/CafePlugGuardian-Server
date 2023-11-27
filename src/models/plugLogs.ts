import { Document, Schema, model } from 'mongoose';

interface IPlugLog extends Document {
  userId: number;
  cafeId: number;
  startTime: Date;
  endTime: Date;
  assignPower: number;
  usedPower: number;
}

const plugLogScheme: Schema = new Schema<IPlugLog>({

});