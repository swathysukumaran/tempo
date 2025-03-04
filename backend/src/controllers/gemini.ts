import express from 'express';
import { AI_PROMPT, UPDATE_PROMPT } from '../helpers/AIprompt';
import { chatSession } from '../helpers/AIModel';
import { get } from 'lodash';
import { createNewTrip, getTripById, updateTripItinerary } from '../db/trip';
import { getPreferences } from '../db/userPreferences';


export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location,timeframe,startDate,endDate,  travelers,
    preferences,budget} = req.body;
        const userId = get(req, 'identity._id');
        console.log("location",location)
        const FINAL_PROMPT = AI_PROMPT
    .replace(/{{formData.destination}}/g, location.description || "")
    .replace(/{{formData.timeframe}}/g, timeframe)
    .replace(/{{formData.startDate}}/g, startDate)
    .replace(/{{formData.endDate}}/g, endDate)
    .replace(/{{formData.travelers}}/g, travelers)
    .replace(/{{formData.preferences}}/g, preferences)
    .replace(/{{formData.budget}}/g, budget)
    ;

                console.log(FINAL_PROMPT);

        if (chatSession) {
            
            
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
            console.log(resultText);
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
        
            const parsedResponse=JSON.parse(aiResponse);
            const generatedItinerary=parsedResponse.generatedItinerary;
            const trip=await createNewTrip(userId,{location,timeframe,startDate,endDate,  travelers,
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
        console.log(FINAL_PROMPT);

        if (chatSession) {   
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
            console.log(resultText);
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
            const parsedResponse=JSON.parse(aiResponse);
            console.log("parsed ",parsedResponse);
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