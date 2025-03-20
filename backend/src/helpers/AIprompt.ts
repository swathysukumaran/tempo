

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
1. Your output MUST ONLY be valid JSON. No text before or after the JSON object.
2. Your output MUST match the schema structure defined below exactly.
3. The JSON must include all fields from the schema - if data isn't applicable, use null values.
4. Each day must include breakfast, lunch, and dinner with specific time slots.
5. Include at least 3 hotel suggestions.
6. Each activity must have a specific time slot (e.g., "9:00 AM - 11:00 AM").
7. Ensure all strings are properly escaped and the JSON is complete.
8. DO NOT truncate or abbreviate any content.

Schema:
{
  "generatedItinerary": {
    "trip_name": "string",
    "destination": "string",
    "duration": "string",
    "travelers": "string",
    "cover_image_url": null,
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price": "string",
        "rating": 4.5,
        "description": "string",
        "hotel_image_url": null
      }
    ],
    "itinerary": {
      "day 1": {
        "theme": "string",
        "best_time_to_visit": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "ticket_pricing": "string",
            "rating": 4.5,
            "travel_time": "string",
            "place_image_url": null,
            "time_slot": "string"
          }
        ]
      }
    }
  },
  "tripDetails": {
    "budget": "${budget}",
    "location": {
      "description": "string",
      "full_destination_name": "string"
    },
    "timeframe": "string",
    "preferences": "string",
    "narrative": "string",
    "transportation": {
      "airport": {
        "name": "string",
        "code": "string",
        "description": "string"
      },
      "local_transport": ["string", "string", "string"],
      "transportation_tips": [
        {"tip": "string", "details": "string"},
        {"tip": "string", "details": "string"},
        {"tip": "string", "details": "string"}
      ]
    }
  }
}

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
