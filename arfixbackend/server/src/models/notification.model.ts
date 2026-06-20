import mongoose, { Model, Schema, Types } from "mongoose";

export interface INotification {
  user: Types.ObjectId;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  data?: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    type: { type: String, default: "GENERAL" },
    isRead: { type: Boolean, default: false },
    data: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, versionKey: false },
);

const Notification: Model<INotification> = mongoose.model<INotification>(
  "Notification",
  notificationSchema,
);

export default Notification;
