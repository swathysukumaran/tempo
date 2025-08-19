import express from 'express';
import {get} from 'lodash';
import { EXTRACT_PROMPT,formFieldSchema } from 'helpers/AIprompt';
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

// Extract data fields from the prompt
export const extractDataFromPrompt= async (req:express.Request,res:express.Response)=>{
    const {prompt}=req.body;
    try{
        const result=await model.generateContent({
            contents:[{role:"user",parts:[{text:EXTRACT_PROMPT(prompt)}]}],
            generationConfig: {
                      temperature: 0.4, // Lower temperature for more deterministic responses
                      maxOutputTokens: 8192,
                      topP: 0.95,
                      topK: 40,
                      responseMimeType: "application/json",
                      responseSchema:formFieldSchema
                    },
        });
        console.log('API call successful:', result.response);

    }catch(error){
        console.error('Error extracting data from prompt:', error);
        return res.status(500).json({ error: 'Failed to extract data from prompt' });
    }
}