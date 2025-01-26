import { createTrip } from '../controllers/gemini';
import express from 'express';

export default (router:express.Router)=>{
    router.post('/ai/create-trip',createTrip);
};