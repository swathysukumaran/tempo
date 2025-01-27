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
        const savedTrip = await trip.save();
        console.log("Trip created successfully");
        return savedTrip;  // Return the saved trip
    }catch(err){
        throw new Error(err.message);
    }
    
}

export const getTripById=async(tripId:string)=>{
    try{
        const trip=await TripModel.findById(tripId);
        return trip;

    }catch(error){
        throw new Error(error.message);
    }
}