import { Document, Schema, model } from 'mongoose';

interface IPlugOffLog extends Document {
  plugUseId: number;
  plugId: number;
  plugName: string;
  type: string;
  plugOffTime: Date;
  ownerCheck: boolean;
  isToggleOn: boolean;
}

const plugOffLog: Schema = new Schema<IPlugOffLog>({
  plugUseId: { type: Number, required: true },
  plugId: { type: Number, required: true },
  plugName: { type: String, required: true },
  type: { type: String, required: true },
  plugOffTime: { type: Date, required: true },
  ownerCheck: { type: Boolean, required: true },
  isToggleOn: { type: Boolean, required: true }
});

const PlugOffLogs = model<IPlugOffLog>('plugOffLogs', plugOffLog);

export default PlugOffLogs;
