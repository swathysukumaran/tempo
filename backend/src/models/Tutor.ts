import mongoose, { Schema, Model } from 'mongoose';
import { ITutor } from '../types/tutor.types';

const TimeSlotSchema: Schema = new Schema({
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  }
});

const DayAvailabilitySchema: Schema = new Schema({
  day: {
    type: String,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    required: true
  },
  slots: [TimeSlotSchema]
});

const TutorSchema: Schema = new Schema<ITutor>({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  },
  bio: {
    type: String,
    required: true
  },
  profileImg: {
    type: String
  },
  subjects: [{
    type: String,
    required: true
  }],
  gradeLevel: [{
    type: String,
    required: true
  }],
  experience: {
    type: Number,
    required: true
  },
  education: {
    type: String,
    required: true
  },
  certifications: [{
    type: String
  }],
  hourlyRate: {
    type: Number,
    required: true
  },
  availability: [DayAvailabilitySchema],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Tutor: Model<ITutor> = mongoose.model<ITutor>('Tutor', TutorSchema);

export default Tutor;
