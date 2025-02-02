import { getOnboarding, startOnboarding, updateOnboarding } from '../db/onboarding';
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

export const updateOnboardingSteps=async(req:express.Request,res:express.Response)=>{
    try{
        const userId=get(req,'identity._id');
        if(!userId){
            return res.sendStatus(403);
        }
        const {status,completedSteps,preferences}=req.body;
        const onboarding=await updateOnboarding(userId,status,completedSteps,preferences);
        res.status(200).json({onboarding});
        return;

    }catch(error){
        res.sendStatus(500);
        return;
    }
}

export const getOnboardingStatus=async(req:express.Request,res:express.Response)=>{

    try{

        const userId=get(req,'identity._id');
        if(!userId){
            return res.sendStatus(403);
        }
        const onboarding=await getOnboarding(userId);
        res.status(200).json({onboarding});
        return;
    }catch(error){
        res.sendStatus(500);
        return;
    }
}