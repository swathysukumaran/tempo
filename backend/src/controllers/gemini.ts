import express from 'express';
import { AI_PROMPT, UPDATE_PROMPT } from '../helpers/AIprompt';
import { chatSession } from '../helpers/AIModel';
import { get } from 'lodash';
import { createNewTrip, getTripById, updateTripItinerary } from '../db/trip';
import { getPreferences } from '../db/userPreferences';


export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location,timeframe,  travelers,
    preferences,budget} = req.body;
        const userId = get(req, 'identity._id');
    
        const FINAL_PROMPT = AI_PROMPT(
    location.label,
    timeframe,
    travelers,
    preferences,
    budget,
    
  );

                

        if (chatSession) {
            
            
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
       
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
        
            const parsedResponse=JSON.parse(aiResponse);
            const narrative=parsedResponse.tripDetails.narrative;
            const generatedItinerary=parsedResponse.generatedItinerary;
            const trip=await createNewTrip(userId,{location,timeframe,narrative, travelers,
    preferences,budget},generatedItinerary);
            res.status(200).json({
                tripId: trip._id,
            });
            return;
            } else {
            res.status(400).send("Chat session not found");
            return;
            }
    

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }

}

export const updateTrip = async (req: express.Request, res: express.Response) => {

    try{
        const { tripId } = req.params;
        const { changeRequest } = req.body;
        const userId = get(req, 'identity._id');

        const trip = await getTripById( tripId);
    
        if (!trip) {
         res.status(404).json({ error: "Trip not found" });
         return;
        }
        const FINAL_PROMPT = UPDATE_PROMPT(trip, changeRequest);
       

        if (chatSession) {   
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
           
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
            const parsedResponse=JSON.parse(aiResponse);
           
            const generatedItinerary=parsedResponse;
            const trip=await updateTripItinerary(userId,tripId,generatedItinerary);
            res.status(200).json(trip);
            return;
            } else {
            res.status(400).send("Chat session not found");
            return;
            }
    

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }

}