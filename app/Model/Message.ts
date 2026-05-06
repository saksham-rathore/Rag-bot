import mongoose, { Schema, Types } from "mongoose";

export interface Message extends Document{
  _id: Types.ObjectId
  userId: Types.ObjectId
  documentId: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
  updatedAt: Date
}

const Messagechema: Schema<Message> = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})