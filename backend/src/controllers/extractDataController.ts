import express from 'express';
import {get} from 'lodash';
import { EXTRACT_PROMPT } from 'helpers/AIprompt';
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

    }
}