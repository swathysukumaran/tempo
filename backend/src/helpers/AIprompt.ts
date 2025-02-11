export const AI_PROMPT = `Return a json formatted data only. Result should be json object only.  Generate a personalized Travel Plan for {location} for {totalDays} Days, tailored for {traveler} with a budget of {budget}.

Travel Style Preferences:
- Pace: {pace} (this traveler prefers a {pace} travel pace)
- Activity Level: {activityLevel}
- Preferred Activities: {activities}
- Daily Start Time: {startTime}
- Food Preferences: {foodApproach} with interest in {diningStyles}
- Preferences to Avoid: {avoidances}

Please provide:
1. Hotel options that match the travel style and preferences:
   - Hotel name, address, price, hotel image url, geo coordinates, rating, descriptions
   - Focus on {pace}-paced locations and {foodApproach}-friendly dining options nearby

2. Daily itinerary that:
   
   - Focuses on their interests: {activities}
   - Starts around their preferred time: {startTime}
   - Avoids: {avoidances}
   - For each activity include: place name, place details, place image url, geo coordinates, ticket pricing, rating, travel time, best time to visit

Return only JSON formatted data including a cover image for the trip.`;