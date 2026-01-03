import mongoose, { Schema, Model } from 'mongoose';

// FIX: Removed 'extends Document' to prevent the _id conflict
export interface IPaste {
  _id: string; 
  content: string;
  views: number;
  max_views?: number;
  expires_at?: Date;
  created_at: Date;
}

const PasteSchema: Schema = new Schema({
  _id: { type: String, required: true }, // We manually set the string ID
  content: { type: String, required: true },
  views: { type: Number, default: 0 },
  max_views: { type: Number }, 
  expires_at: { type: Date },  
  created_at: { type: Date, default: Date.now },
}, { _id: false }); // Tells Mongoose not to auto-generate an ObjectId

// Prevent model recompilation error in Next.js hot reload
const Paste: Model<IPaste> = mongoose.models.Paste || mongoose.model<IPaste>('Paste', PasteSchema);

export default Paste;