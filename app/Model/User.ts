import mongoose, { Schema, Document, ObjectId, Types } from "mongoose";

export interface User extends Omit<Document, "_id"> {
  _id: Types.ObjectId
  Username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  Password: string;
}
  
const UserSchema: Schema<User> = new mongoose.Schema({
  Username: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
  },
},{
    timestamps: true,
});

export default mongoose.models.User || mongoose.model<User>("User", UserSchema)