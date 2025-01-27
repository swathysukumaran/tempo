
import express from 'express';
import { isAuthenticated } from '../middlewares';
import { getTripDetails } from '../controllers/trip';

export default (router:express.Router)=>{
    router.get('/trip-details/:tripId',isAuthenticated,getTripDetails);
};