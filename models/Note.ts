import mongoose, { Schema, Document, Model } from "mongoose";

export interface INote extends Document {
  userId: string;     // Stores the Clerk User ID
  title: string;
  content: string;
  tags: string[];     // Array of strings for AI tags
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema<INote> = new Schema(
  {
    userId: { type: String, required: true, index: true }, 
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], default: [] },
  },
  { 
    timestamps: true 
  }
);

// This check prevents Mongoose from recompiling the model during hot reloads
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>("Note", NoteSchema);

export default Note;