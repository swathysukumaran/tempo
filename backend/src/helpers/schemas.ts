import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    username: z.string().min(2, 'Username must be at least 2 characters').max(50),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const createTripSchema = z.object({
    location: z.object({
        label: z.string().min(1).max(200),
        value: z.any().optional(),
    }),
    timeframe: z.string().min(1).max(100),
    travelers: z.string().min(1).max(100),
    preferences: z.string().min(1).max(500),
    budget: z.enum(['cheap', 'moderate', 'luxury']),
});

export const updateTripSchema = z.object({
    changeRequest: z.string().min(1, 'Change request is required').max(1000),
});

export const shareTripSchema = z.object({
    email: z.string().email('Invalid email address'),
    permission: z.enum(['view', 'edit']).default('view'),
});

export const lookupPlaceSchema = z.object({
    placeName: z.string().min(1, 'Place name is required').max(200),
});
