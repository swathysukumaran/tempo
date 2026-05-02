import { lookupPlace } from '../controllers/places';
import { isAuthenticated } from '../middlewares';
import express from 'express';

export default(router:express.Router)=>{
    router.post('/lookup-place', isAuthenticated, lookupPlace);
}