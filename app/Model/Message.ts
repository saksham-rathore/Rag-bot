import mongoose, { Schema, Types, Document} from "mongoose";

export interface Message extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  documentId: Types.ObjectId;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema<Message> = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true
  },
  content: {
    type: String,
    required: true
  },
},{
    timestamps: true
});

export default mongoose.models.Message || mongoose.model<Message>("Message", MessageSchema)