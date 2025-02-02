
import express from 'express';
import { createOnboarding, updateOnboardingSteps, getOnboardingStatus } from '../controllers/onboarding';

export default (router: express.Router)=> {
    router.post('/onboarding/start',createOnboarding);
    router.put('/onboarding/update',updateOnboardingSteps);
    router.get('/onboarding/status',getOnboardingStatus);
}