import { isAuthenticated } from '../middlewares';
import { createTrip, updateItinerary } from '../controllers/itinerary';
import { validate } from '../middlewares/validate';
import { createTripSchema, updateTripSchema } from '../helpers/schemas';
import express from 'express';

export default (router:express.Router)=>{
    router.post('/ai/create-trip', isAuthenticated, validate(createTripSchema), createTrip);
    router.post('/ai/update-trip/:tripId', isAuthenticated, validate(updateTripSchema), updateItinerary);
};