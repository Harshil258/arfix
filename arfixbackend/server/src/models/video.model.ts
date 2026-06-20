import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVideo extends Document {
  url: string;
  youtubeId: string;
  title?: string;
  description?: string;
  addedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const videoSchema = new Schema<IVideo>(
  {
    url: {
      type: String,
      required: [true, "URL is required"],
      unique: true,
      trim: true,
    },
    youtubeId: {
      type: String,
      required: [true, "YouTube ID is required"],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: null,
    },
    description: {
      type: String,
      trim: true,
      default: null,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Format output
videoSchema.set("toJSON", {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform: (_doc: unknown, ret: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    ret.id = ret._id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete ret._id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete ret.__v;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return ret;
  },
});

const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);
export default Video;
