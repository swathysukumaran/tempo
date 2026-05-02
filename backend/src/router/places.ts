import { lookupPlace } from '../controllers/places';
import { isAuthenticated } from '../middlewares';
import { validate } from '../middlewares/validate';
import { lookupPlaceSchema } from '../helpers/schemas';
import express from 'express';

export default(router:express.Router)=>{
    router.post('/lookup-place', isAuthenticated, validate(lookupPlaceSchema), lookupPlace);
}