// server/src/types/user.types.ts
import { Document } from 'mongoose';

export enum UserRole {
  PARENT = 'parent',
  STUDENT = 'student',
  ADMIN = 'admin'
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  profileImg?: string;
  createdAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

export interface UserRequest extends Request {
  user?: IUser;
}

export interface JwtPayload {
  user: {
    id: string;
    role: UserRole;
  };
}

// server/src/types/tutor.types.ts
import { Document } from 'mongoose';

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface DayAvailability {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  slots: TimeSlot[];
}

export interface ITutor extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio: string;
  profileImg?: string;
  subjects: string[];
  gradeLevel: string[];
  experience: number;
  education: string;
  certifications?: string[];
  hourlyRate: number;
  availability: DayAvailability[];
  isActive: boolean;
  createdAt: Date;
}

// server/src/types/booking.types.ts
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

// server/src/types/payment.types.ts
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

// server/src/types/testimonial.types.ts
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

// server/src/types/package.types.ts
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