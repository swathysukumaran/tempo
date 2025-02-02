import { startOnboarding } from '../db/onboarding';
import express, { response } from 'express';
import { get } from 'lodash';

export const createOnboarding = async (req: express.Request, res: express.Response) => {

    try{
        const userId=get(req, 'identity._id');
         if (!userId) {
            return res.sendStatus(403); // Unauthorized if no user ID
        }
        const onboarding=await startOnboarding(userId);
        res.status(200).json({onboarding});
        return;

    }catch(error){
        res.sendStatus(500);
        return;
    }
}