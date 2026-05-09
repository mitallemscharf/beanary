import mongoose from 'mongoose';

const shotSchema = new mongoose.Schema({
  beanId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Bean', required: true },
  dose:           { type: Number, required: true },
  grindSize:      { type: Number, required: true },
  extractionTime: { type: Number, required: true },
  yieldG:         { type: Number, required: true },
  temperature:    { type: String, enum: ['1', '2', '3', '4'], default: '2' },
  rating:         { type: Number, min: 1, max: 5, required: true },
  brewRatio:      { type: Number },
  flavorTags:     { type: [String], default: [] },
  notes:          { type: String, default: '' },
  createdAt:      { type: Date, default: Date.now }
});

shotSchema.pre('save', function (next) {
  if (this.dose > 0) {
    this.brewRatio = Math.round((this.yieldG / this.dose) * 100) / 100;
  }
  next();
});

export default mongoose.models.Shot || mongoose.model('Shot', shotSchema);
