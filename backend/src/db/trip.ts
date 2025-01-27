import mongoose from 'mongoose';

const TripSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    tripDetails:Object,
    generatedItinerary:Object,
    createdAt:{type:Date,default:Date.now},
});

export const TripModel=mongoose.model('Trip',TripSchema);

export const createNewTrip=async(userId:string,tripDetails:Record<string,any>,generatedItinerary:Record<string,any>)=>{
    console.log("Creating new trip");
    try{
        const trip=new TripModel({
            userId,
            tripDetails,
            generatedItinerary
        });
         await trip.save();
         console.log("Trip created successfully");
         return;
    }catch(err){
        throw new Error(err.message);
    }
    
}