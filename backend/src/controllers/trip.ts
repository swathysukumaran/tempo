import { get } from 'lodash';
import { getTripById, getUserTrips } from '../db/trip';
import { UserModel } from '../db/users';
import express from 'express';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import asyncHandler from '../helpers/asyncHandler';

export const getTripDetails = asyncHandler(async (req: express.Request, res: express.Response) => {
    const tripId = req.params.tripId;
    const trip = await getTripById(tripId);
    if (!trip) {
        res.status(404).json({ error: 'Trip not found' });
        return;
    }

    const userId = get(req, 'identity._id') as unknown as string;
    const user = await UserModel.findById(userId);
    const isOwner = trip.userId.toString() === userId.toString();
    const isShared = trip.sharedWith?.some((entry) => entry.email === user?.email);

    if (!isOwner && !isShared) {
        res.status(403).json({ error: 'Access denied' });
        return;
    }

    res.status(200).json(trip);
});

export const getAllTrips = asyncHandler(async (req: express.Request, res: express.Response) => {
    const userId = get(req, 'identity._id') as unknown as string;
    const page  = Math.max(1, parseInt(req.query.page  as string) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
    const result = await getUserTrips(userId, page, limit);
    res.status(200).json(result);
});

export const shareTrip = asyncHandler(async (req: express.Request, res: express.Response) => {
    const userId = get(req, 'identity._id') as unknown as string;
    const { email, permission } = req.body;
    const tripId = req.params.tripId;

    const trip = await getTripById(tripId);
    if (!trip) {
        res.status(404).json({ error: 'Trip not found' });
        return;
    }

    const alreadyShared = trip.sharedWith?.some((entry) => entry.email === email);
    if (alreadyShared) {
        res.status(400).json({ error: 'Trip already shared with this user' });
        return;
    }

    trip.sharedWith.push({ email, permission });
    await trip.save();
    await sendTripShareEmail(email, trip._id, userId);
    res.status(200).json({ message: 'Trip shared successfully' });
});

export const sendTripShareEmail=async (toEmail:string,tripId:mongoose.Types.ObjectId, userId:string)=>{
    
    const transporter=nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:process.env.SENDER_EMAIL,
            pass:process.env.EMAIL_APP_PASSWORD,
        }
    });

    const frontendURL=`${process.env.FRONTEND_URL}/trip/${tripId}`;
    console.log('Frontend URL:',frontendURL);
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
        html: `<div style="font-family: 'Plus Jakarta Sans', 'Segoe UI', sans-serif; background-color: #F9FAFB; padding: 24px;">
  <div style="
      max-width: 600px;
      margin: auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #E5E7EB; /* soft gray border */
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06); /* subtle soft shadow */
    ">

    <!-- Header -->
    <div style="background-color: #0D9488; color: white; padding: 28px 24px; text-align: center;">
      <h2 style="margin: 0; font-size: 2rem; font-weight: 700;">🌟 Your Trip is Ready</h2>
      <p style="margin-top: 8px; font-size: 1rem;">Shared with you via <strong>Tempo</strong>, your AI travel companion</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 24px; text-align: center;">
      <p style="font-size: 1rem; color: #374151; margin-bottom: 16px;">
        <strong>${inviterName}</strong> just shared a curated travel plan with you 🌍
      </p>
      <p style="font-size: 0.95rem; color: #6B7280; margin-bottom: 24px;">
        Handpicked hotels, must-see attractions, and personalized tips — your itinerary is just a click away.
      </p>

      <!-- Button -->
      <a href="${frontendURL}" style="
        display: inline-block;
        margin-top: 10px;
        padding: 14px 28px;
        background-color: #D14343;
        color: white;
        text-decoration: none;
        font-weight: 600;
        border-radius: 8px;
        font-size: 1rem;
        transition: background-color 0.3s ease;">
        ✈️ View My Trip Plan
      </a>
    </div>

    <!-- Divider -->
    <div style="border-top: 1px solid #E5E7EB; margin: 0 24px;"></div>

    <!-- Footer -->
    <div style="background-color: #F3F4F6; padding: 20px 24px; text-align: center; font-size: 0.85rem; color: #6B7280;">
      <p style="margin: 0;">👤 Shared by <strong>${inviterName}</strong></p>
      <p style="margin-top: 6px;">Made with 💚 by <strong>Tempo</strong></p>
    </div>

  </div>
</div>

`,
    })
}