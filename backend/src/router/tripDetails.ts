
import express from 'express';
import { isAuthenticated } from '../middlewares';
import { getTripDetails } from '../controllers/trip';

export default (router:express.Router)=>{
    router.post('/ai/create-trip',isAuthenticated,getTripDetails);
};