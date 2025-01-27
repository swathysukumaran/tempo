import express from 'express';
import { AI_PROMPT } from '../helpers/AIprompt';
import { chatSession } from '../helpers/AIModel';
import { get } from 'lodash';
import { createNewTrip } from '../db/trip';


export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location, noOfDays, budget, traveler} = req.body;
        const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",location|| "").replace("{totalDays}", noOfDays).replace("{traveler}", traveler).replace("{budget}", budget);

        if (chatSession) {
            const userId = get(req, 'identity._id');
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            const resultText = result.response.candidates[0].content.parts[0].text;
            const aiResponse = resultText.replace(/```json\n|\n```/g, '');
            const generatedItinerary=JSON.parse(aiResponse);
            const trip=await createNewTrip(userId,{location,noOfDays,budget,traveler},generatedItinerary);
            res.status(200).send(generatedItinerary);
            return
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
