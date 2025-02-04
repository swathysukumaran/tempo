import express from 'express';
import { AI_PROMPT } from '../helpers/AIprompt';
import { chatSession } from '../helpers/AIModel';
import { get } from 'lodash';
import { createNewTrip } from '../db/trip';
import { getPreferences } from '../db/userPreferences';


export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location, noOfDays, budget, traveler} = req.body;
        const userId = get(req, 'identity._id');
        const userPreferences = await getPreferences(userId);

        if (!userPreferences) {
            res.status(400).json({ error: "User preferences not found" });
            return;
        }
        const FINAL_PROMPT = AI_PROMPT
            .replace("{location}", location.description || "")
            .replace("{totalDays}", noOfDays)
            .replace("{traveler}", traveler)
            .replace("{budget}", budget)
            .replace("{pace}", userPreferences.pace)
            .replace("{activityLevel}", userPreferences.activityLevel)
            .replace("{activities}", userPreferences.activities.join(", "))
            .replace("{startTime}", userPreferences.startTime)
            .replace("{foodApproach}", userPreferences.foodApproach)
            .replace("{diningStyles}", userPreferences.diningStyles.join(", "))
            .replace("{avoidances}", userPreferences.avoidances.length > 0 
                ? userPreferences.avoidances.join(", ") 
                : "no specific avoidances");

        if (chatSession) {
            
            
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
            const generatedItinerary=JSON.parse(aiResponse);
            console.log(generatedItinerary);
            const trip=await createNewTrip(userId,{location,noOfDays,budget,traveler},generatedItinerary);
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
