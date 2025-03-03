export const AI_PROMPT = `Generate a travel itinerary in JSON format based on the following user input. Adhere strictly to the provided JSON schema.

User Input:

Location: {{formData.destination}}
Timeframe: {{formData.timeframe}}
Start Date: {{formData.startDate}}
End Date: {{formData.endDate}}
Travelers: {{formData.travelers}}
Preferences: {{formData.preferences}}
Budget: {{formData.budget}}


Instructions:
1.  Create a detailed travel itinerary that is **highly customized** based on the user's preferences.
2.  **Prioritize** activities and experiences that align with the user's interests.
3.  **Tailor** the itinerary to reflect the user's specific requests in {{formData.preferences}}.
4.  Create a detailed travel itinerary, including daily activities, hotel recommendations, and overall trip details.
5.  The "duration" field in the 'generatedItinerary' should be a human-readable description of the trip's length (e.g., "5 days, 4 nights").
6.  The "travelers" field in 'generatedItinerary' should accurately reflect the user's input.
7.  The "budget" field in 'tripDetails' should match the user's input.
8.  If 'startDate' and 'endDate' are provided, include them in 'tripDetails.
9.  Generate realistic and engaging content for all descriptions and details.
10.  If a cover image or hotel image is available then include the URL, if not then set to null.
11.  If any information is not available, then set that value to null.
12.  Return the response in a valid JSON format that adheres strictly to the following schema:
13. Include a "transportation" section within the 'tripDetails' object. This section should include the following data:
    * "airport": { "name": "string", "code": "string", "description": "string"},
    * "local_transport": ["string", "string", "string"], //List of common local transport options
    * "transportation_tips": [
        {"tip": "string", "details": "string"},
        {"tip": "string", "details": "string"},
        {"tip": "string", "details": "string"}
    ] // Array of transportation tips, each with a brief tip and details.
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
    "startDate": "string | null",
    "endDate": "string | null",
    "preferences": "string",
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
}`;

export const UPDATE_PROMPT = (trip:any, changeRequest:string) => {
  return`
You are a travel itinerary editor. Your task is to modify an existing travel itinerary based on a user's request, ensuring that the changes are accurately incorporated while preserving the rest of the itinerary.

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
5.  **Return the complete, updated itinerary in valid JSON format, adhering strictly to the following schema structure:**
\`\`\`json
${JSON.stringify(trip.generatedItinerary, null, 2)}
\`\`\`
6.  If the user's request is unclear or ambiguous, make a reasonable interpretation or ask for clarification.
`};