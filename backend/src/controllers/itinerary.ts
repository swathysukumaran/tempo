import express from 'express';
import { AI_PROMPT, UPDATE_PROMPT, schema } from '../helpers/AIprompt';
import { get } from 'lodash';
import { createNewTrip, getTripById, updateTripItinerary } from '../db/trip';
import { getUserById } from '../db/users';
import asyncHandler from '../helpers/asyncHandler';

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
const MAX_RETRIES = 3;

async function generateWithRetry(prompt: string) {
    let attempts = 0;
    let lastError = null;

    while (attempts < MAX_RETRIES) {
        try {
            const modifiedPrompt = attempts > 0
                ? `${prompt}\n\nIMPORTANT: Previous attempts failed with error: "${lastError}". Please ensure your response is COMPLETE, VALID JSON with no truncation, no text before or after, and all strings properly escaped.`
                : prompt;

            const result = await model.generateContent({
                contents: [{ role: "user", parts: [{ text: modifiedPrompt }] }],
                generationConfig: {
                    temperature: 0.4,
                    maxOutputTokens: 8192,
                    topP: 0.95,
                    topK: 40,
                    responseMimeType: "application/json",
                    responseSchema: schema
                },
            });
            return result.response;
        } catch (apiError) {
            lastError = apiError.message;
            console.warn(`API call attempt ${attempts + 1} failed: ${apiError.message}`);
            attempts++;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
    }

    throw new Error(`Failed after ${MAX_RETRIES} attempts. Last error: ${lastError}`);
}

export const createTrip = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { location, timeframe, travelers, preferences, budget } = req.body;
    const userId = get(req, 'identity._id');

    const FINAL_PROMPT = AI_PROMPT(location.label, timeframe, travelers, preferences, budget);

    if (FINAL_PROMPT.length > 30000) {
        res.status(400).json({ error: 'Prompt exceeds maximum allowed length' });
        return;
    }

    const response = await generateWithRetry(FINAL_PROMPT);
    const text = response.text();
    const itinerary = extractJSON(text);

    const narrative = itinerary.tripDetails.narrative;
    const generatedItinerary = itinerary.generatedItinerary;
    const trip = await createNewTrip(userId, { location, timeframe, narrative, travelers, preferences, budget }, generatedItinerary);

    res.status(201).json({ tripId: trip._id });
});

export const updateItinerary = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { tripId } = req.params;
    const { changeRequest } = req.body;
    const userId = get(req, 'identity._id');

    const trip = await getTripById(tripId);
    if (!trip) {
        res.status(404).json({ error: "Trip not found" });
        return;
    }

    const currentUser = await getUserById(userId);
    const isOwner = trip.userId.toString() === ((userId ?? '').toString());
    const isSharedEditor = trip.sharedWith?.some(
        (entry) => entry.email === currentUser.email && entry.permission === 'edit'
    );

    if (!isOwner && !isSharedEditor) {
        res.status(403).json({ error: "You don't have permission to modify this trip" });
        return;
    }

    const prompt = UPDATE_PROMPT(trip, changeRequest);

    if (prompt.length > 30000) {
        res.status(400).json({ error: 'Prompt exceeds maximum allowed length' });
        return;
    }

    const response = await generateWithRetry(prompt);
    const text = response.text();
    const updatedItinerary = extractJSON(text);
    const newTrip = await updateTripItinerary(tripId, updatedItinerary);

    res.status(200).json(newTrip);
});

function extractJSON(text: string) {
    try {
        return JSON.parse(text);
    } catch {
        console.log("Direct JSON parse failed, trying to extract JSON..");
    }

    const jsonRegex = /```json\s*(\{[\s\S]*\})\s*```|(\{[\s\S]*\})/;
    const match = text.match(jsonRegex);
    if (match) {
        return JSON.parse((match[1] || match[2]).trim());
    }

    const fixedText = attemptToFixJSON(text);
    try {
        return JSON.parse(fixedText);
    } catch (error) {
        throw new Error(`Invalid or incomplete JSON response from AI: ${error.message}`);
    }
}

function attemptToFixJSON(text: string) {
    let jsonCandidate = text;
    const startPos = jsonCandidate.indexOf('{');
    if (startPos !== -1) jsonCandidate = jsonCandidate.substring(startPos);
    const endPos = jsonCandidate.lastIndexOf('}');
    if (endPos !== -1) jsonCandidate = jsonCandidate.substring(0, endPos + 1);

    return jsonCandidate
        .replace(/(?<=":.*[^\\])"(?=.*[,}])/g, '\\"')
        .replace(/([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g, '$1"$2"$3')
        .replace(/,(\s*[}\]])/g, '$1');
}
