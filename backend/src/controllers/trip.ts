import { get } from 'lodash';
import { getTripById,getUserTrips} from '../db/trip';
import { UserModel } from '../db/users';
import express from 'express';
import mongoose from 'mongoose';



export const getTripDetails=async(req:express.Request,res:express.Response)=>{
    try{
        const tripId=req.params.tripId;
        const trip=await getTripById(tripId);

        res.status(200).json(trip);
        return;

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}


export const getAllTrips = async (req: express.Request, res: express.Response) => {
    try {
        const userId = get(req, 'identity._id');
        
        if (!userId) {
            res.status(401).json({ error: 'User not authenticated' });
             return;
        }

        const trips = await getUserTrips(userId);

         res.status(200).json({ trips });
         return;
    } catch (error) {
        console.error('Error fetching user trips:', error);
         res.status(500).json({ error: 'Failed to fetch trips' });
         return;
    }
};

export const shareTrip = async(req:express.Request, res:express.Response)=>{
    try{
        
        const userId=get(req,'identity._id') as string;
        const email=req.body.email;
        const tripId=req.params.tripId;
        if(!userId){
            res.status(401).json({error:'User not authenticated'});
            return;
        }
        if(!email){
            res.status(400).json({error:'Email not provided'});
            return;
        }
        const trip=await getTripById(tripId);
        if(!trip){
            res.status(403).json({error:'Trip not found'});
            return;
        }
        if(trip.userId.toString()!== userId.toString()){
            res.status(403).json({ error: 'Not authorized to share this trip' });
            return ;
        }
        const targetUser=await UserModel.findOne({email});
        if(!targetUser){
            res.status(403).json({error:'Target user not found'});
            return;
        }
        const alreadyShared=trip.sharedWith?.some((entry)=>entry.userId.toString()=== targetUser._id.toString());
        if(alreadyShared){
            res.status(403).json({error:'Trip already shared with this user'});
            return;
        }
        trip.sharedWith?.push({
            userId: targetUser._id,
            permission: 'view'
        });

        await trip.save();
        res.status(200).json({message:'Trip shared successfully'});
        return;

    }catch(error){
        console.error('Error sharing trip:',error);
        res.status(500).json({error:'Failed to share trip'});
        return;
    }
}