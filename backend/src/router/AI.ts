import { isAuthenticated } from '../middlewares';
import { createTrip ,updateItinerary} from '../controllers/itinerary';

import express from 'express';
import { extractDataFromPrompt } from '../controllers/extractDataController';

export default (router:express.Router)=>{
    router.post('/ai/create-trip',isAuthenticated,createTrip);
    router.post('/ai/update-trip/:tripId',isAuthenticated,updateItinerary);
    router.post('/ai/extract',extractDataFromPrompt);
};