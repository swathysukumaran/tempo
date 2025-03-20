import express from 'express';
import { AI_PROMPT, UPDATE_PROMPT } from '../helpers/AIprompt';
import { get } from 'lodash';
import { createNewTrip, getTripById, updateTripItinerary } from '../db/trip';
import { getPreferences } from '../db/userPreferences';
import {z} from 'zod';
const {
  GoogleGenerativeAI,
} = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });
const apiKey = process.env.GEMINI_API_KEY;

// Initialize the API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
const MAX_RETRIES = 3;

// Define a schema for validation using Zod
const HotelSchema = z.object({
  hotel_name: z.string(),
  hotel_address: z.string(),
  price: z.string(),
  rating: z.number(),
  description: z.string(),
  hotel_image_url: z.string().nullable()
});

const ActivitySchema = z.object({
  place_name: z.string(),
  place_details: z.string(),
  ticket_pricing: z.string(),
  rating: z.number(),
  travel_time: z.string(),
  place_image_url: z.string().nullable(),
  time_slot: z.string()
});

const DaySchema = z.object({
  theme: z.string(),
  best_time_to_visit: z.string(),
  activities: z.array(ActivitySchema)
});

const ItinerarySchema = z.record(z.string(), DaySchema);

const GeneratedItinerarySchema = z.object({
  trip_name: z.string(),
  destination: z.string(),
  duration: z.string(),
  travelers: z.string(),
  cover_image_url: z.string().nullable(),
  hotels: z.array(HotelSchema),
  itinerary: ItinerarySchema
});

const TransportationSchema = z.object({
  airport: z.object({
    name: z.string(),
    code: z.string(),
    description: z.string()
  }),
  local_transport: z.array(z.string()),
  transportation_tips: z.array(z.object({
    tip: z.string(),
    details: z.string()
  }))
});

const TripDetailsSchema = z.object({
  budget: z.enum(['budget', 'moderate', 'luxury']),
  location: z.object({
    description: z.string(),
    full_destination_name: z.string()
  }),
  timeframe: z.string(),
  preferences: z.string(),
  narrative: z.string(),
  transportation: TransportationSchema
});

const TravelItinerarySchema = z.object({
  generatedItinerary: GeneratedItinerarySchema,
  tripDetails: TripDetailsSchema
});
// Add this function to your gemini.ts file

// Function to generate content with retries

async function generateWithRetry(prompt: string) {
  let attempts = 0;
  let lastError = null;

  while (attempts < MAX_RETRIES) {
    try {
      // Add a retry-specific instruction if this is a retry attempt
      const modifiedPrompt = attempts > 0 
        ? `${prompt}\n\nIMPORTANT: Previous attempts failed with error: "${lastError}". Please ensure your response is COMPLETE, VALID JSON with no truncation, no text before or after, and all strings properly escaped.` 
        : prompt;
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: modifiedPrompt }] }],
        generationConfig: {
          temperature: 0.4, // Lower temperature for more deterministic responses
          maxOutputTokens: 8192,
          topP: 0.95,
          topK: 40,
        },
      });
      
      return result.response;
    } catch (apiError) {
      lastError = apiError.message;
      console.warn(`API call attempt ${attempts + 1} failed: ${apiError.message}`);
      attempts++;
      
      // Wait a bit longer between retries (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
    }
  }
  
  throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
}

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

                 // Safety check for prompt size
    if (FINAL_PROMPT.length > 30000) {
       res.status(400).json({ error: 'Prompt exceeds maximum allowed length' });
       return;
    }

       
            
            
            const response = await generateWithRetry(FINAL_PROMPT);
    const text = response.text();
    // Extract the JSON content from the response if there's any text before or after

    const itinerary=extractAndValidateJSON(text);
    res.json(itinerary);

    }catch(error){
        console.error('Error generating itinerary:',error);
        res.sendStatus(500).json({
            error: 'Failed to generate itinerary',
            details:error.message
        });
        return;
    }

}

function extractAndValidateJSON(text:string){
    try{
    // Attempt 1: Try to parse the entire text as JSON
    try{
        const parsedData=JSON.parse(text);
        // Validate against schema
        const validatedData=TravelItinerarySchema.parse(parsedData);
        return validatedData;

    }catch(parseError){
        console.log("Direct JSON parse failed, trying to extract JSON..");
    }
    // Attempt 2: Try to extract JSON between backticks or braces
    const jsonRegex=/```json\s*(\{[\s\S]*\})\s*```|(\{[\s\S]*\})/;
    const match=text.match(jsonRegex);
    if(match){
        const jsonStr=(match[1] || match[2]).trim();
        const parsedData=JSON.parse(jsonStr);
        // validate against schema
        const validatedData=TravelItinerarySchema.parse(parsedData);
        return validatedData;
    }
    // Attempt 3:Fix common JSON errors and try again
    const fixedText=attemptToFixJSON(text);
    const parsedData=JSON.parse(fixedText);
    const validatedData=TravelItinerarySchema.parse(parsedData);
    return validatedData;
    }catch(error){
        console.error('Error extracting or validating JSON:',error);
        throw new Error(`Invalid or incomplete JSON response:${error.message}`);
    }
}

// Function to attempt to fix common JSON errors

function attemptToFixJSON(text:string){
    // Try to identify and extract just the json portion
    let jsonCandidate=text;
    // Remove any text before the first '{'

    const startPos=jsonCandidate.indexOf('{');
    if(startPos !==-1){
        jsonCandidate=jsonCandidate.substring(startPos);
    }
    // Remove any text after the last '}'
    const endPos = jsonCandidate.lastIndexOf('}');
    if(endPos !==-1){
        jsonCandidate=jsonCandidate.substring(0,endPos+1);
    }

    // Fix common JSON syntax errors
    jsonCandidate=jsonCandidate
    // Fix unescaped quotes in strings
    .replace(/(?<=":.*[^\\])"(?=.*[,}])/g, '\\"')
    // Fix missing quotes around property names
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
    // Fix trailing commas in objects and arrays
    .replace(/,(\s*[}\]])/g, '$1');
  
  return jsonCandidate;
}
// Update an existing Itinerary
export const updateItinerary=async (req:express.Request,res:express.Response)=>{
    try{
        const {trip,changeRequest}=req.body;
        if(!trip || !changeRequest){
            res.status(400).json({
                error:'Missing trip or change request data'
            });
            return;
        }
        const prompt=UPDATE_PROMPT(trip,changeRequest);
        if(prompt.length>30000){
            res.status(400).json({error:'Prompt exceeds maximum allowed length'});
            return;
        }
        const response = await generateWithRetry(prompt);
    const text = response.text();
    
    // Extract and validate JSON from the response
    const updatedItinerary = extractAndValidateJSON(text);
    
    res.json(updatedItinerary);
    }catch(error){
        console.error('Error updating itinerary:',error);
        res.status(500).json({
            error:'Failed to update itinerary',
            details:error.message
        });
    }
};
