
import express from 'express';
import { isAuthenticated } from '../middlewares';
import { getAllTrips, getTripDetails } from '../controllers/trip';

export default (router:express.Router)=>{
    router.get('/trip-details/:tripId',isAuthenticated,getTripDetails);
    router.get('/trips',isAuthenticated,getAllTrips);
    
};