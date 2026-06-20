import mongoose, { Model, Schema } from "mongoose";

export interface ICampaign {
  title: string;
  description: string;
  image: string;
  type: string;
  multiplier: number;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    type: { type: String, default: "MULTIPLIER" },
    multiplier: { type: Number, default: 1 },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

const Campaign: Model<ICampaign> = mongoose.model<ICampaign>("Campaign", campaignSchema);

export default Campaign;
