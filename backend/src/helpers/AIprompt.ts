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