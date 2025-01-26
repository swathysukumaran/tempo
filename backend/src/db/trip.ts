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