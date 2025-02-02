import mongoose from 'mongoose';


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

export const getPreferences=()=>PreferencesModel.find();
