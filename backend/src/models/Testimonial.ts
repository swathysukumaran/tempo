import mongoose, { Schema, Model } from 'mongoose';
import { ITestimonial } from '../types/testimonial.types';

const TestimonialSchema: Schema = new Schema<ITestimonial>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutor: {
    type: Schema.Types.ObjectId,
    ref: 'Tutor',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  content: {
    type: String,
    required: true
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Testimonial: Model<ITestimonial> = mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default Testimonial;
