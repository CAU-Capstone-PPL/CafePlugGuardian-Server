import { Document, Schema, model } from 'mongoose';

interface IPlugOffLog extends Document {
  plugId: number;
  plugUseId: number;
  type: string;
  plugOffTime: Date;
  ownerCheck: boolean;
  isToggleOn: boolean;
}

const plugOffLog: Schema = new Schema<IPlugOffLog>({
  plugId: { type: Number, required: true },
  plugUseId: { type: Number, required: true },
  type: { type: String, required: true },
  plugOffTime: { type: Date, required: true },
  ownerCheck: { type: Boolean, required: true },
  isToggleOn: { type: Boolean, required: true }
});

const PlugOffLogs = model<IPlugOffLog>('plugOffLogs', plugOffLog);

export default PlugOffLogs;
