

export const AI_PROMPT = (
  destination: string,
  timeframe: string,

  travelers: string | null,
  preferences: string,
  budget: "budget" | "moderate" | "luxury"
): string => {
  return `
Generate a very detailed travel itinerary with **specific time slots to each activity** in JSON format based STRICTLY on the following user input. Do not deviate from the provided information.

User Input:

Location: ${destination}
Timeframe: ${timeframe}
Travelers: ${travelers}
Preferences: ${preferences}
Budget: ${budget}

Instructions:

1.  **ABSOLUTELY ENSURE that the itinerary is generated for the EXACT LOCATION provided in the "Location" field above: ${destination}. Do not use any other location.**
2.  **Use the EXACT TIMEFRAME, START DATE, END DATE, NUMBER OF TRAVELERS, PREFERENCES, and BUDGET provided above. Do not infer or add any additional information.**
3.  Create a detailed and HIGHLY CUSTOMIZED travel itinerary based on the user's preferences, ${preferences}.
4.  Prioritize activities and experiences that DIRECTLY ALIGN with the user's interests.
5.  Tailor the itinerary to REFLECT the user's specific requests.
6.  Generate realistic and engaging content for all descriptions and details.
7. ** Provide a precise schedule for each day**, including specific time slots for each activity (e.g., 9:00 AM - 11:00 AM).
8.  **Must ensure If there are any free time slots for relaxation, explicitly mention them **(e.g., "3:00 PM - 5:00 PM: Free time for relaxation at the hotel pool").
9. ** Make sure to plan the entire day**.
10.  Provide detailed descriptions of each activity, including what to expect, any relevant tips.
11.  The "duration" field in 'generatedItinerary' should be a human-readable description of the trip's length (e.g., "5 days, 4 nights").
12.  The "travelers" field in 'generatedItinerary' should accurately reflect the user's input.
13.  The "budget" field in 'tripDetails' should match the user's input.
14. If a cover image or hotel image is available, include the URL; otherwise, set to null.
15. If any information is not available, set that value to null.
16. Include a "narrative" section within the 'tripDetails' object with ** a concise personalized  engaging introduction that to the trip that convey the essence of the trip and creates excitement and anticipation **
17. Return the response in a VALID JSON FORMAT that ADHERES STRICTLY to the following schema.
18. ** ABSOLUTELY ensure that each day of the itinerary includes breakfast lunch and dinner suggestions, and specific time slots for each activity. **
**Make sure to include atleast 3 hotel suggestions**
19. Include a "transportation" section within the 'tripDetails' object with:
    * "airport": { "name": "string", "code": "string", "description": "string"}.
    * "local_transport": ["string", "string", "string"] (common local transport options).
    * "transportation_tips": [{"tip": "string", "details": "string"}, ...] (transportation tips).

\`\`\`json
{
  "generatedItinerary": {
    "trip_name": "string",
    "destination": "string",
    "duration": "string",
    "travelers": "string",
    "cover_image_url": "string | null",
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price": "string",
        "rating": "number",
        "description": "string",
        "hotel_image_url": "string | null"
      }
    ],
    "itinerary": {
      "day [number]": {
        "theme": "string",
        "best_time_to_visit": "string",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "ticket_pricing": "string",
            "rating": "number",
            "travel_time": "string",
            "place_image_url": "string | null"
            "time_slot": "string"
          }
        ]
      },
      // Add more "day [number]" entries as needed based on the trip's duration.
    }
  },
  "tripDetails": {
    "budget": "budget" | "moderate" | "luxury",
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
\`\`\`
`;
};





export const UPDATE_PROMPT = (trip:any, changeRequest:string) => {
  return`
You are a travel itinerary editor. Your task is to modify an existing travel itinerary based on a user's request, ensuring that the changes are accurately incorporated while preserving the rest of the itinerary and **return just the JSON formatted data**.

EXISTING ITINERARY:
\`\`\`json
${JSON.stringify(trip.generatedItinerary, null, 2)}
\`\`\`

USER REQUESTED CHANGES:
${changeRequest}

Instructions:

1.  Carefully analyze the user's requested changes ${changeRequest}and identify the specific parts of the itinerary ${JSON.stringify(trip.generatedItinerary, null, 2)} that need modification.
2.  Make only the changes requested by the user. Do not add or remove any other activities or information unless explicitly requested.
3.  **Ensure that the updated itinerary accurately reflects the user's requested changes ${changeRequest}**.
4.  Preserve the original structure and all other details of the itinerary that were not affected by the user's request.
5.  **Return the complete, updated itinerary in valid JSON format, ADHERES STRICTLY  to the following schema structure:
\`\`\`json
${JSON.stringify(trip.generatedItinerary, null, 2)}
\`\`\`

`};