import mongoose, { Model, Schema } from "mongoose";

export interface IBanner {
  image: string;
  title: string;
  actionType: string;
  actionId: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bannerSchema = new Schema<IBanner>(
  {
    image: { type: String, required: true },
    title: { type: String, required: true },
    actionType: { type: String, required: true },
    actionId: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false },
);

const Banner: Model<IBanner> = mongoose.model<IBanner>("Banner", bannerSchema);

export default Banner;
