import express from 'express';
import { transcribeAudio } from '../controllers/speechController';
import { isAuthenticated } from '../middlewares';

export default (router:express.Router)=>{
    router.post('/transcribe', isAuthenticated, transcribeAudio);
};