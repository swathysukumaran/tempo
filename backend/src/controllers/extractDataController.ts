import express from 'express';
import {get} from 'lodash';
import { EXTRACT_PROMPT,formFieldSchema } from '../helpers/AIprompt';
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Extract data fields from the prompt
export const extractDataFromPrompt= async (req:express.Request,res:express.Response)=>{
    const {prompt}=req.body;
    if(!prompt?.trim()){
        res.status(400).json({error:'Prompt is required'});
        return ;
    }
    try{
        const result=await model.generateContent({
            contents:[{role:"user",parts:[{text:EXTRACT_PROMPT(prompt)}]}],
            generationConfig: {
                      temperature: 0.4, // Lower temperature for more deterministic responses
                      maxOutputTokens:500,
                      topP: 0.95,
                      topK: 40,
                      responseMimeType: "application/json",
                      responseSchema:formFieldSchema
                    },
        });
        const body= await result.response.text();
         res.status(200).json(JSON.parse(body));
         return;

    }catch(error){
        console.error('Error extracting data from prompt:', error);
        res.status(500).json({ error: 'Failed to extract data from prompt' });
        return ;
    }
}