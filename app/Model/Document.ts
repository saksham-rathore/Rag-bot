import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDocument extends Omit<Document, "_id"> {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  fileUrl: string;
  createdAt: Date;
}

const DocumentSchema: Schema<IDocument> = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Document ||
  mongoose.model<IDocument>("Document", DocumentSchema);