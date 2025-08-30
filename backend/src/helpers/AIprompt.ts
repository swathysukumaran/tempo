

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

export const EXTRACT_PROMPT=(prompt:string)=>{
  return `You are Tempo’s Trip Brief extractor. Read and analyze the user’s free-text and return ONLY JSON (no prose) to prefill a verification form.
Do NOT generate an itinerary or hotels.

INPUT
<<<
${prompt}
>>>

RULES
- Return exactly one JSON object. No extra text.
- Use numbers when the user gives them (e.g., “3 days” → nights: 3).
- When something is vague, don’t invent details. Use null and add a short clarify question.
- Keep required anchors structured; let nuanced preferences be strings.
- Multi-city allowed (destinations is an array).
- Keep the output compact; avoid full sentences where a short phrase works.

SCHEMA (keep keys as written)
{
  "parsed": {
    "destinations": [ { "name": "string", "place_id": "string|null" } ],

    "time": {
      "dateRange": { "start": "YYYY-MM-DD|null", "end": "YYYY-MM-DD|null" } | null,
      "month": "YYYY-MM|null",
      "nights": number|null,
      "season": "spring|summer|fall|winter|null",
      "availability": [ "string" ]  // e.g., "weekdays 9-17 busy", "evenings only", "mornings preferred"
    },

    "party": {
      "tags": [ "string" ],          // e.g., "friends","couple","family","with-kid:7","with-senior"
      "notes": "string|null"         // free text like “two families traveling together”
    },

    "intent": "string|null",         // e.g., "explore","romantic","foodie","relax"
    "priorities": [ "string" ],      // up to 3 short phrases, e.g., "kid-friendly","local food","budget-friendly"
    "interests": [ "string" ],       // e.g., "museums","bakeries","nightlife"
    "mustDos": [ "string" ],         // explicit must-do items mentioned

    "budgetPolicy": {
      "overall": "string|null",      // e.g., "economy","moderate","premium"
      "hotels": "string|null",       // allows split like "economy for hotels"
      "food": "string|null",
      "activities": "string|null",
      "notes": "string|null"         // e.g., "splurge on experiences only"
    },

    "constraints": [ "string" ],     // e.g., "max-walk:2h","no late nights","wheelchair-friendly"

    "specialEvents": [
      { "date": "YYYY-MM-DD|null", "description": "string" }  // e.g., romantic dinner on 2025-05-12
    ],

    "rules": [
      { "scope": "day|evening|hotels|activities|dining|specific_date",
        "requirement": "string",     // e.g., "weekday daytime blocked (meetings)", "evenings only"
        "strength": "lock|prefer" }
    ]
  },

  "assumptions": [ { "field": "string", "value": "string|number", "reason": "string" } ],
  "clarify": [ "string" ],           // max 2 short questions for missing required items
  "confidences": [ { "name": "string", "confidence": 0.0 } ],
  "missingRequired": [ "destinations" | "time.dateRange" | "time.month" | "time.nights" ]
}

REQUIRED ANCHORS FOR LATER:
- Must have destinations AND (time.dateRange OR (time.month AND time.nights)).
- If these are missing, leave them null and add appropriate items to missingRequired and clarify.

OUTPUT
- Return ONLY the JSON object above. No explanations or markdown.

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
  additionalProperties: false,
  properties: {
    normalized: {
      type: "object",
      additionalProperties: false,
      properties: {
        destinations: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string" },
              place_id: { type: ["string", "null"] }
            },
            required: ["name"]
          }
        },
        time: {
          type: ["object", "null"],
          additionalProperties: false,
          properties: {
            dateRange: {
              type: ["object", "null"],
              additionalProperties: false,
              properties: {
                start: { type: ["string", "null"] }, // "YYYY-MM-DD"
                end:   { type: ["string", "null"] }  // "YYYY-MM-DD"
              }
            },
            month:        { type: ["string", "null"] }, // "YYYY-MM"
            nights:       { type: ["number", "null"] },
            season:       { type: ["string", "null"] }, // e.g., "spring"
            durationHint: { type: ["string", "null"] }, // e.g., "few_days","weekend"
            availability: {
              type: "array",
              items: { type: "string" } // e.g., "evenings only"
            }
          }
        },
        party: {
          type: "object",
          additionalProperties: false,
          properties: {
            tags:  { type: "array", items: { type: "string" } }, // "friends","couple","with-kid:7"
            notes: { type: ["string", "null"] }
          }
        },
        intent:      { type: ["string", "null"] },
        priorities:  { type: "array", items: { type: "string" } }, // up to 3 short phrases
        interests:   { type: "array", items: { type: "string" } },
        mustDos:     { type: "array", items: { type: "string" } },
        budgetPolicy: {
          type: "object",
          additionalProperties: false,
          properties: {
            overall:   { type: ["string", "null"] }, // "economy","moderate","comfort","premium"
            hotels:    { type: ["string", "null"] },
            food:      { type: ["string", "null"] },
            activities:{ type: ["string", "null"] },
            notes:     { type: ["string", "null"] }  // e.g., "splurge on experiences"
          }
        },
        constraints:   { type: "array", items: { type: "string" } },
        specialEvents: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              date:        { type: ["string", "null"] }, // "YYYY-MM-DD"
              description: { type: "string" }
            },
            required: ["description"]
          }
        },
        rules: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              scope:       { type: "string" }, // "day","evening","hotels","activities","dining","specific_date"
              requirement: { type: "string" },
              strength:    { type: "string" }  // "lock" or "prefer"
            },
            required: ["scope","requirement","strength"]
          }
        }
      }
    },

    form: {
      type: "object",
      additionalProperties: false,
      properties: {
        location:             { type: "string" },
        timeframe:            { type: "string" },
        travelers:            { type: "string" },
        preferences:          { type: "string" },
        budget:               { type: "string" },
        companions:           { type: "string" },
        travel_style:         { type: "string" },
        special_requirements: { type: "string" }
      }
    },

    meta: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingRequired: {
          type: "array",
          items: { type: "string" } // e.g., "destinations","time.dateRange","time.month","time.nights"
        },
        confidences: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              name:       { type: "string" },
              confidence: { type: "number", minimum: 0, maximum: 1 }
            },
            required: ["name","confidence"]
          }
        },
        clarify: { type: "array", items: { type: "string" } } // short follow-up questions
      },
      required: ["missingRequired","confidences"]
    }
  },
  required: ["normalized","form","meta"]
};
