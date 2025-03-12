import { Document } from 'mongoose';
import { Types } from 'mongoose';

export interface ITestimonial extends Document {
  user: Types.ObjectId;
  tutor: Types.ObjectId;
  rating: number;
  content: string;
  isApproved: boolean;
  createdAt: Date;
}

