import { Document } from 'mongoose';
import { Types } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface IPayment extends Document {
  user: Types.ObjectId;
  booking?: Types.ObjectId;
  packageId?: Types.ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  transactionId?: string;
  paymentDate: Date;
}
