import { get } from 'lodash';
import { getTripById,getUserTrips} from '../db/trip';
import { UserModel } from '../db/users';
import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';


export const getTripDetails=async(req:express.Request,res:express.Response)=>{
    try{
        const tripId=req.params.tripId;
        const trip=await getTripById(tripId);
        if(!trip){
            res.status(404).json({error:'Trip not found'});
            return;
        }
        const userId=get(req,'identity._id') as string;
        const user=await UserModel.findById(userId);
        const isOwner=trip.userId.toString()===userId.toString();
        const isShared=trip.sharedWith?.some((entry)=>entry.email=== user.email);
        
        if(!isOwner && !isShared){
            res.status(403).json({error:'Access denied'});
            return;
        }
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
        
        const targetUser=await UserModel.findOne({email});
        if(!targetUser){
            trip.sharedWith.push({
            email,
            permission: 'view'
            });
        }
        const alreadyShared=trip.sharedWith?.some((entry)=>entry.email=== targetUser.email);
        if(alreadyShared){
            res.status(403).json({error:'Trip already shared with this user'});
            return;
        }
        trip.sharedWith?.push({
            email:targetUser.email,
            permission: 'view'
        });

        await trip.save();
        await sendTripShareEmail(targetUser.email, trip._id,userId);
        res.status(200).json({message:'Trip shared successfully'});
        return;

    }catch(error){
        console.error('Error sharing trip:',error);
        res.status(500).json({error:'Failed to share trip'});
        return;
    }
}

export const sendTripShareEmail=async (toEmail:string,tripId:mongoose.Types.ObjectId, userId:string)=>{
    
    const transporter=nodemailer.createTransport({
        service:'SendGrid',
        auth:{
            user:'apikey',
            pass:process.env.SENDGRID_API_KEY,
        }
    });

    const frontendURL=`http://localhost:5173/trip/${tripId}`;
    const inviter=await UserModel.findById(userId);
    if(!inviter){
        console.error('Inviter not found');
        return;
    }
    const inviterName=inviter.username || inviter.email || 'Tempo User';
    await transporter.sendMail({
        from:process.env.SENDER_EMAIL,
        to:toEmail,
        subject:'You have been invited to a trip!',
        html: `
    <div style="font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f6f6f6; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #3c8453; color: white; padding: 24px 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">Your Travel Adventure Awaits ✈️</h2>
          <p style="margin: 6px 0 0;">Curated by Tempo, your personal AI travel planner</p>
        </div>
        
        <!-- Body -->
        <div style="padding: 30px; text-align: center;">
          <p style="font-size: 16px; color: #333;">
            <strong>${inviterName}</strong> has shared a personalized travel itinerary with you via <strong>Tempo</strong> 🌍
          </p>
          <p style="font-size: 15px; color: #666;">
            Dive in to explore destinations, hotels, activities, and more — all tailored just for you.
          </p>
          <a href="${frontendURL}" style="
            display: inline-block;
            margin-top: 20px;
            padding: 14px 28px;
            background-color: #3c8453;
            color: white;
            text-decoration: none;
            font-weight: 600;
            border-radius: 8px;
            transition: background-color 0.3s ease;">
            View Trip Plan 🚀
          </a>
        </div>

        <!-- Footer -->
        <div style="background-color: #f0f0f0; padding: 16px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">This trip was shared with you by ${inviterName}</p>
          <p style="margin: 4px 0 0;">Made with 💚 by <strong>Tempo</strong> — AI Travel Planning, Reimagined.</p>
        </div>

      </div>
    </div>
  `,
    })
}