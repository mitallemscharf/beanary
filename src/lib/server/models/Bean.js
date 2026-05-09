import mongoose from 'mongoose';

const beanSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  roaster:    { type: String, required: true },
  origin:     { type: String, default: '' },
  roastDate:  { type: Date },
  roastLevel: { type: String, enum: ['hell', 'medium', 'dunkel'], default: 'medium' },
  flavorTags: { type: [String], default: [] },
  notes:      { type: String, default: '' },
  createdAt:  { type: Date, default: Date.now }
});

export default mongoose.models.Bean || mongoose.model('Bean', beanSchema);
