export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: "🧍", // Single person emoji
    people: 1,
  },
  {
    id: 2,
    title: "Couple",
    desc: "Perfect for two travelers on a shared journey",
    icon: "👫", // Couple emoji
    people: 2,
  },
  {
    id: 3,
    title: "Family",
    desc: "For families enjoying an adventure together",
    icon: "👨‍👩‍👧‍👦", // Family emoji
    people: 4,
  },
  {
    id: 4,
    title: "Friends",
    desc: "A group of friends ready for fun",
    icon: "👯", // Friends emoji
    people: 5,
  },
  {
    id: 5,
    title: "Group",
    desc: "A large group embarking on a shared experience",
    icon: "🌍", // Globe emoji
    people: 10,
  },
  {
    id: 6,
    title: "Students",
    desc: "Student groups traveling for study or fun",
    icon: "🎓", // Graduation cap emoji
    people: 15,
  },
  {
    id: 7,
    title: "Corporate Team",
    desc: "Teams traveling for corporate retreats or meetings",
    icon: "🏢", // Office building emoji
    people: 20,
  },
  {
    id: 8,
    title: "Adventure Seekers",
    desc: "Thrill-seekers looking for exciting adventures",
    icon: "⛰️", // Mountain emoji
    people: 8,
  },
  {
    id: 9,
    title: "Solo Backpacker",
    desc: "An independent backpacker exploring the world",
    icon: "🎒", // Backpack emoji
    people: 1,
  },
  {
    id: 10,
    title: "Tour Group",
    desc: "Large groups organized for sightseeing tours",
    icon: "🚌", // Bus emoji
    people: 30,
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of cost",
    icon: "💰", // Money bag emoji
  },
  {
    id: 2,
    title: "Affordable",
    desc: "Great value for your money",
    icon: "💵", // Dollar bills emoji
  },
  {
    id: 3,
    title: "Moderate",
    desc: "A balance between cost and comfort",
    icon: "💸", // Money with wings emoji
  },
  {
    id: 4,
    title: "Premium",
    desc: "Luxury and comfort within reach",
    icon: "💳", // Credit card emoji
  },
  {
    id: 5,
    title: "Luxury",
    desc: "Top-tier experiences and comfort",
    icon: "💎", // Gem emoji
  },
  {
    id: 6,
    title: "Backpacker",
    desc: "Minimal cost for adventurous travelers",
    icon: "🎒", // Backpack emoji
  },
  {
    id: 7,
    title: "Eco-Friendly",
    desc: "Budget-friendly and sustainable",
    icon: "🌱", // Leaf emoji
  },
  {
    id: 8,
    title: "All-Inclusive",
    desc: "Everything included for convenience",
    icon: "👑", // Crown emoji
  },
  {
    id: 9,
    title: "Budget Family",
    desc: "Affordable trips for the whole family",
    icon: "👨‍👩‍👧‍👦", // Family emoji
  },
  {
    id: 10,
    title: "Ultra-Luxury",
    desc: "Exclusive, luxurious, and personalized experiences",
    icon: "✨", // Sparkles emoji
  },
];

export const AI_PROMPT =
  "Generate Travel Plan for Location: {location} for {totalDays} Days for {traveler} with a budget of {budget}, give me hotels options list with hotel name,hotel address,price,hotel image url,geo coordinates, rating,descriptions and suggest itinary with place name,place details, place image url,geo coordinates,ticket pricing,rating,time travel for each of the locations for 3 days with each day plan with best time to visit in json format";
