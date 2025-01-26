import express from 'express';
import { AI_PROMPT } from '../helpers/AIprompt';
import { chatSession } from '../helpers/AIModel';


export const createTrip = async (req: express.Request, res: express.Response) => {

    try{
        const {location, noOfDays, budget, traveler} = req.body;
        const FINAL_PROMPT = AI_PROMPT.replace(
        "{location}",location|| "").replace("{totalDays}", noOfDays).replace("{traveler}", traveler).replace("{budget}", budget);

        if (chatSession) {
            const result = await chatSession.sendMessage(FINAL_PROMPT);
            res.status(200).send(result);
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
