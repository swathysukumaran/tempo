import express from 'express';
import { get } from 'lodash';
import { getPreferences } from '../db/userPreferences';

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