import { Document } from 'mongoose';
import { Types } from 'mongoose';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export enum BookingMode {
  ONLINE = 'online',
  IN_PERSON = 'in-person'
}

export interface IBooking extends Document {
  user: Types.ObjectId;
  tutor: Types.ObjectId;
  subject: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  mode: BookingMode;
  status: BookingStatus;
  notes?: string;
  createdAt: Date;
}
