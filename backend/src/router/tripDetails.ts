import express from 'express';
import { isAuthenticated } from '../middlewares';
import { getAllTrips, getTripDetails, shareTrip } from '../controllers/trip';
import { validate } from '../middlewares/validate';
import { shareTripSchema } from '../helpers/schemas';

export default (router:express.Router)=>{
    router.get('/trip-details/:tripId', isAuthenticated, getTripDetails);
    router.get('/trips', isAuthenticated, getAllTrips);
    router.post('/trips/:tripId/share', isAuthenticated, validate(shareTripSchema), shareTrip);
};