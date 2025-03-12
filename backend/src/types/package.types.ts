import { Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  description: string;
  sessions: number;
  duration: number; // Duration per session in minutes
  price: number;
  discountPercentage: number;
  subjectTypes?: string[];
  isActive: boolean;
  createdAt: Date;
}