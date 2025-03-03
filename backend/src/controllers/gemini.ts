import express from 'express';
import { AI_PROMPT } from '../helpers/AIprompt';
import { chatSession } from '../helpers/AIModel';
import { get } from 'lodash';
import { createNewTrip } from '../db/trip';
import { getPreferences } from '../db/userPreferences';


export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location,timeframe,startDate,endDate,  travelers,
    preferences,budget} = req.body;
        const userId = get(req, 'identity._id');
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
        
            const generatedItinerary=JSON.parse(aiResponse);
            console.log(generatedItinerary);
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
