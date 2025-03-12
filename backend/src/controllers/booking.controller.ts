import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Tutor from '../models/Tutor';
import { BookingStatus, BookingMode } from '../types/booking.types';
import { IUser } from '../types/user.types';

interface AuthRequest extends Request {
  user?: IUser;
}

// Get all bookings for logged in user
export const getUserBookings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    const bookings = await Booking.find({ user: req.user.id })
      .populate('tutor', 'firstName lastName profileImg subjects')
      .sort({ date: -1 });
      
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get booking by ID
export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    const booking = await Booking.findById(req.params.id)
      .populate('tutor', 'firstName lastName profileImg subjects hourlyRate')
      .populate('user', 'firstName lastName email');
      
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if booking belongs to user or user is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(booking);
  } catch (err) {
    console.error(err);
    
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Create new booking
export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    const {
      tutorId,
      subject,
      date,
      startTime,
      endTime,
      duration,
      mode,
      notes
    } = req.body;
    
    // Check if tutor exists and is active
    const tutor = await Tutor.findOne({ _id: tutorId, isActive: true });
    if (!tutor) {
      return res.status(404).json({ msg: 'Tutor not found or inactive' });
    }
    
    // Check if tutor teaches the subject
    if (!tutor.subjects.includes(subject)) {
      return res.status(400).json({ msg: 'Tutor does not teach this subject' });
    }
    
    // Check tutor availability
    const bookingDate = new Date(date);
    const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
    
    const dayAvailability = tutor.availability.find(a => a.day === dayOfWeek);
    if (!dayAvailability) {
      return res.status(400).json({ msg: 'Tutor not available on this day' });
    }
    
    const isSlotAvailable = dayAvailability.slots.some(
      slot => slot.startTime === startTime && slot.endTime === endTime && !slot.isBooked
    );
    
    if (!isSlotAvailable) {
      return res.status(400).json({ msg: 'Selected time slot is not available' });
    }
    
    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      tutor: tutorId,
      subject,
      date: bookingDate,
      startTime,
      endTime,
      duration,
      mode: mode as BookingMode,
      notes
    });
    
    const booking = await newBooking.save();
    
    // Update tutor availability
    await Tutor.updateOne(
      { 
        _id: tutorId, 
        'availability.day': dayOfWeek,
        'availability.slots.startTime': startTime,
        'availability.slots.endTime': endTime
      },
      { $set: { 'availability.$.slots.$[slot].isBooked': true } },
      { arrayFilters: [{ 'slot.startTime': startTime, 'slot.endTime': endTime }] }
    );
    
    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update booking status
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: 'User not authenticated' });
    }
    
    const { status } = req.body;
    
    if (!Object.values(BookingStatus).includes(status as BookingStatus)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    // Check if user is authorized (admin or booking owner)
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    booking.status = status as BookingStatus;
    
    // If booking is cancelled, update tutor availability
    if (status === BookingStatus.CANCELLED) {
      const bookingDate = new Date(booking.date);
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bookingDate.getDay()];
      
      await Tutor.updateOne(
        { 
          _id: booking.tutor, 
          'availability.day': dayOfWeek,
          'availability.slots.startTime': booking.startTime,
          'availability.slots.endTime': booking.endTime
        },
        { $set: { 'availability.$.slots.$[slot].isBooked': false } },
        { arrayFilters: [{ 'slot.startTime': booking.startTime, 'slot.endTime': booking.endTime }] }
      );
    }
    
    await booking.save();
    
    res.json(booking);
  } catch (err) {
    console.error(err);
    
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Booking not found' });
    }
    
    res.status(500).send('Server error');
  }
};
