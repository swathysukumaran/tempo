import mongoose, { Schema, Model } from 'mongoose';
import { IPackage } from '../types/package.types';

const PackageSchema: Schema = new Schema<IPackage>({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  sessions: {
    type: Number,
    required: true
  },
  duration: {
    type: Number, // Duration per session in minutes
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  discountPercentage: {
    type: Number,
    default: 0
  },
  subjectTypes: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Package: Model<IPackage> = mongoose.model<IPackage>('Package', PackageSchema);

export default Package;