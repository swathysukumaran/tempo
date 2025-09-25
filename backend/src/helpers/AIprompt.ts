

export const AI_PROMPT = (
  destination: string,
  timeframe: string,
  travelers: string | null,
  preferences: string,
  budget: "budget" | "moderate" | "luxury"
): string => {
  return `
You are a specialized travel API that ONLY outputs valid JSON data in the exact format requested.

Task: Generate a detailed travel itinerary for the following parameters:
- Location: ${destination}
- Timeframe: ${timeframe}
- Travelers: ${travelers}
- Preferences: ${preferences}
- Budget: ${budget}
Requirements:
1. The JSON must include all fields from the schema - if data isn't applicable, use null values.
2. The itinerary must include activities for all the days in the timeframe following {
  "itinerary": [
    {
      "day": 1,
      "theme": "...",
      "best_time_to_visit": "...",
      "activities": [...]
    },
    // ... day 2, day 3, etc. ...
  ]
}.
2. Each day must include breakfast, lunch, and dinner with specific time slots .
3. Ensure all the activities suggested are in the location specified.
4. Ensure the activities are suitable for the travelers and preferences.
5. Include at least 3 activities for each day unless specified otherwise in the user preference.
5. Include at least 3 hotel suggestions.
6. Each activity must have a specific time slot (e.g., "9:00 AM - 11:00 AM") and ensure they are open at the suggested time slot.
7. Ensure all strings are properly escaped and the JSON is complete.
8. DO NOT truncate or abbreviate any content.

Important: I will be directly parsing your response as JSON. Any text before or after the JSON, or any syntax errors, will cause a failure. Return ONLY valid, complete JSON data.
`;
};




export const UPDATE_PROMPT = (trip: any, changeRequest: string) => {
  return `
You are a specialized travel API that ONLY outputs valid JSON data.

Task: Modify the existing travel itinerary below based on the user's requested changes.

Existing itinerary:
${JSON.stringify(trip.generatedItinerary, null, 2)}

User's requested changes:
${changeRequest}

Requirements:
1. Your output MUST ONLY be valid JSON. No text before or after the JSON object.
2. You must maintain the exact same structure as the original itinerary.
3. Only modify the parts specified in the user's change request.
4. Keep all other details exactly the same.
5. Ensure all strings are properly escaped and the JSON is complete.
6. DO NOT truncate or abbreviate any content.

Important: I will be directly parsing your response as JSON. Any text before or after the JSON, or any syntax errors, will cause a failure. Return ONLY valid, complete JSON data that matches the EXACT structure of the original.
`;
};

export const EXTRACT_PROMPT=(destination:string,prompt:string)=>{
  return `You are Tempo’s Trip Brief extractor.
Return ONLY JSON (no prose / no markdown). The API supplies a responseSchema; follow it exactly.

INPUT
<<<
Destination: ${destination},
User Prompt: ${prompt}
>>>

FILLING RULES (important)
- Output EXACTLY ONE JSON object with BOTH keys: { "fields": {…}, "missingRequired": [...] }.
- Always copy ${destination} into fields.destination.
- Under "fields", ALWAYS include ALL of these keys (use [] or null if unknown):
 time, tags, interests, mustDos, constraints, budget, specialNotes.
- Use numbers when explicit (“3 days” → time.nights: 3).
- Never invent exact dates. If only a month word is given (“in October”), set time.month = null, push "month_hint: October" to specialNotes, and include "time.month" in missingRequired.
- For “few days / weekend / spring”, leave date fields null; add short hints to specialNotes (e.g., "duration_hint: few days", "season: spring") and include the right keys in missingRequired ("time.dateRange" OR ["time.month","time.nights"]).
- Multi-city allowed: destinations is an array. If user mentions a day trip (“day trip to X”), add "day trip to X" to mustDos and include X as a destination if it’s a distinct place.
- Map companions to tags:
  "family" → "family"; "friends" → "friends"; "couple" → "couple";
  "my 7-year-old" / "kid 7" → "with-kid:7"; "parents"/"seniors" → "with-senior".
- Map budget words to budget (fields.budget):
  cheap/low/budget → "economy"; moderate/mid → "moderate"; nice/comfortable → "comfort"; premium/luxury/expensive → "premium".
- Preferences:
  “slow mornings / late starts” → tag "slow-mornings" (or constraint "no-early-mornings");
  Food prefs (bakeries, street food, cafes) → add to interests;
  Museums, nightlife, nature, shopping → interests.
- Keep phrases short (chips, not sentences). Deduplicate arrays. Lowercase where reasonable.
- specialNotes:Always fill this. Write user needs, vibe of the travel, what they want to achieve,any leftover info that couldn't fit in the previous fields (e.g., “I want to relax”, “it’s my honeymoon”, “I love art”, “no hiking”).

REQUIRED ANCHORS (for missingRequired)
- required = destinations AND (time.dateRange OR (time.month AND time.nights)).
- If missing, list the appropriate keys in missingRequired.

  `
}
export const schema=
{
  "type": "object",
  "properties": {
    "generatedItinerary": {
      "type": "object",
      "properties": {
        "trip_name": { "type": "string" },
        "destination": { "type": "string" },
        "duration": { "type": "string" },
        "travelers": { "type": "string" },
        "cover_image_url": { "type": "string", "nullable": true },
        "hotels": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "hotel_name": { "type": "string" },
              "hotel_address": { "type": "string" },
              "price": { "type": "string" },
              "rating": { "type": "number" },
              "description": { "type": "string" },
              "hotel_image_url": { "type": "string", "nullable": true }
            },
            "required": ["hotel_name", "hotel_address", "price", "rating", "description"]
          }
        },
        "itinerary": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "day": { "type": "integer" },
              "theme": { "type": "string" },
              "best_time_to_visit": { "type": "string" },
              "activities": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "place_name": { "type": "string" },
                    "place_address": { "type": "string" },
                    "place_details": { "type": "string" },
                    "ticket_pricing": { "type": "string" },
                    "rating": { "type": "number" },
                    "travel_time": { "type": "string" },
                    "place_image_url": { "type": "string", "nullable": true },
                    "time_slot": { "type": "string" }
                  },
                  "required": ["place_name", "place_details", "ticket_pricing", "rating", "travel_time", "time_slot"]
                }
              }
            },
            "required": ["day", "theme", "best_time_to_visit", "activities"]
          }
        }
      },
      "required": ["trip_name", "destination", "duration", "travelers", "hotels", "itinerary"]
    },
    "tripDetails": {
      "type": "object",
      "properties": {
        "budget": { "type": "string" },
        "location": {
          "type": "object",
          "properties": {
            "description": { "type": "string" },
            "full_destination_name": { "type": "string" }
          },
          "required": ["description", "full_destination_name"]
        },
        "timeframe": { "type": "string" },
        "preferences": { "type": "string" },
        "narrative": { "type": "string" },
        "transportation": {
          "type": "object",
          "properties": {
            "airport": {
              "type": "object",
              "properties": {
                "name": { "type": "string" },
                "code": { "type": "string" },
                "description": { "type": "string" }
              },
              "required": ["name", "code", "description"]
            },
            "local_transport": { "type": "array", "items": { "type": "string" } },
            "transportation_tips": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "tip": { "type": "string" },
                  "details": { "type": "string" }
                },
                "required": ["tip", "details"]
              }
            }
          },
          "required": ["airport", "local_transport", "transportation_tips"]
        }
      },
      "required": ["budget", "location", "timeframe", "preferences", "narrative", "transportation"]
    }
  },
  "required": ["generatedItinerary", "tripDetails"]
}

export const formFieldSchema = {
  type: "object",
  properties: {
    fields: {
      type: "object",
      properties: {
        destination: {
          type: "string",
          required: true
        },
        time: {
          type: "object",
          nullable: true,
          properties: {
            dateRange: {
              type: "object",
              nullable: true,
              properties: {
                start: { type: "string", nullable: true }, // YYYY-MM-DD
                end:   { type: "string", nullable: true }  // YYYY-MM-DD
              }
            },
            month:  { type: "string", nullable: true },     // YYYY-MM
            nights: { type: "number", nullable: true }
          }
        },
        tags:        { type: "array", items: { type: "string" } },   // "friends","family","with-kid:7","business-daytime","evenings-only"
        interests:   { type: "array", items: { type: "string" } },
        mustDos:     { type: "array", items: { type: "string" } },
        constraints: { type: "array", items: { type: "string" } },
        budget:      { type: "string", nullable: true },             // e.g., "economy","moderate","premium"
        specialNotes:{ type: "array", items: { type: "string" } }    // dump leftover info here
      },
      required: ["destinations"]
    },
    missingRequired: { type: "array", items: { type: "string" } }     // e.g., ["time.dateRange"] or ["time.month","time.nights"]
  },
  required: ["fields","missingRequired"]
};
