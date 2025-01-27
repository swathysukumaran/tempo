import { getTripById } from '../db/trip';
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