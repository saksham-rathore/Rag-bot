import mongoose, { Schema, Types } from "mongoose";

export interface IChunk {
  _id: Types.ObjectId;
  documentId: Types.ObjectId;
  text: string;
  embedding: number[];
}

const ChunkSchema = new Schema<IChunk>({
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
});

export default mongoose.models.Chunk ||
  mongoose.model<IChunk>("Chunk", ChunkSchema);
