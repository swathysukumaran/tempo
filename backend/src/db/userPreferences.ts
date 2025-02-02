import mongoose from 'mongoose';
import { userInfo } from 'os';
import { useRevalidator } from 'react-router-dom';
import { Interface } from 'readline';
import { getTripById } from './trip';


const PreferencesSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    preferences: {
        type: Object,
        required: true,
        default: {
        pace: '',
        activities: [],
        activityLevel: '',
        startTime: '',
        foodApproach: '',
        diningStyles: [],
        avoidances: []
        }
    },
    
});

export const PreferencesModel=mongoose.model('Preferences',PreferencesSchema);


export const createPreferences=async(userId: mongoose.Schema.Types.ObjectId,preferences:Object)=>{

    try{
        const newPreferences=new PreferencesModel({
            userId,
            preferences:preferences
        })

    }catch(error){
        console.log(error);
        throw new Error(error.message);
    }
}

export const updatePreferences=async (userId: mongoose.Schema.Types.ObjectId,preferences:Object)=>{
    try{
        return await PreferencesModel.findOneAndUpdate({userId:userId},{preferences:preferences},{new:true});
    }catch(error){
        console.log(error);
        throw new Error(error);

    }

}

export const getPreferences=async(userId:mongoose.Schema.Types.ObjectId)=>{

    try{
        const userPreferences=await PreferencesModel.findOne({userId:userId});
        return userPreferences?userPreferences.preferences:null;
    }
    catch(error){
        console.log(error);
        throw new Error(error);
    }
}