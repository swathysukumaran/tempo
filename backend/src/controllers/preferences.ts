import express from 'express';
import { get } from 'lodash';
import { getPreferences,updatePreferences } from '../db/userPreferences';

export const getUserPreferences=async(req:express.Request,res:express.Response)=>{
    try{
        const userId=get(req, 'identity._id');
        const preferences=await getPreferences(userId)

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}

export const updateUserPreferences=async(req:express.Request,res:express.Response)=>{
    try{
        const userId=get(req, 'identity._id');
        const preferences=get(req, 'body.preferences');
        await updatePreferences(userId,preferences);
    }
    catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}