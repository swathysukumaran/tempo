import express from 'express';

import { getUserPreferences,updateUserPreferences } from '../controllers/preferences';

export default(router:express.Router)=>{
    router.get('/preferences',getUserPreferences);
    router.put('/preferences',updateUserPreferences);
}