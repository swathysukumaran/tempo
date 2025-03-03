import { get } from 'lodash';
import { getTripById,getUserTrips} from '../db/trip';
import express from 'express';



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