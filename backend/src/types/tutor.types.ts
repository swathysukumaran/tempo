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