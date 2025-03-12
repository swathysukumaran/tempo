import { Request, Response } from 'express';
import Tutor from '../models/Tutor';
import { ITutor } from '../types/tutor.types';

// Get all tutors
export const getAllTutors = async (req: Request, res: Response) => {
  try {
    const tutors = await Tutor.find({ isActive: true });
    res.json(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Get tutor by ID
export const getTutorById = async (req: Request, res: Response) => {
  try {
    const tutor = await Tutor.findById(req.params.id);
    
    if (!tutor) {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    
    res.json(tutor);
  } catch (err) {
    console.error(err);
    
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Filter tutors by subject and grade level
export const filterTutors = async (req: Request, res: Response) => {
  try {
    const { subject, gradeLevel } = req.query;
    let query: any = { isActive: true };
    
    if (subject) {
      query.subjects = subject;
    }
    
    if (gradeLevel) {
      query.gradeLevel = gradeLevel;
    }
    
    const tutors = await Tutor.find(query);
    res.json(tutors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Create new tutor (admin only)
export const createTutor = async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      bio,
      profileImg,
      subjects,
      gradeLevel,
      experience,
      education,
      certifications,
      hourlyRate,
      availability
    } = req.body;
    
    // Check if tutor already exists
    let tutor = await Tutor.findOne({ email });
    if (tutor) {
      return res.status(400).json({ msg: 'Tutor already exists' });
    }
    
    // Create new tutor
    tutor = new Tutor({
      firstName,
      lastName,
      email,
      phone,
      bio,
      profileImg,
      subjects,
      gradeLevel,
      experience,
      education,
      certifications,
      hourlyRate,
      availability
    });
    
    await tutor.save();
    res.json(tutor);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// Update tutor (admin only)
export const updateTutor = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const tutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    
    if (!tutor) {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    
    res.json(tutor);
  } catch (err) {
    console.error(err);
    
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Delete tutor (admin only)
export const deleteTutor = async (req: Request, res: Response) => {
  try {
    const tutor = await Tutor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!tutor) {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    
    res.json({ msg: 'Tutor removed' });
  } catch (err) {
    console.error(err);
    
    if ((err as any).kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Tutor not found' });
    }
    
    res.status(500).send('Server error');
  }
};
