import {
  FaUser,
  FaUsers,
  FaChild,
  FaUserFriends,
  FaGlobe,
  FaSchool,
} from "react-icons/fa";
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaWallet,
  FaCreditCard,
  FaGem,
  FaCoins,
  FaCrown,
  FaBalanceScale,
} from "react-icons/fa";

export const SelectTravelersList = [
  {
    id: 1,
    title: "Just Me",
    desc: "A sole traveler in exploration",
    icon: <FaUser />, // Single user icon
    people: 1,
  },
  {
    id: 2,
    title: "Couple",
    desc: "Perfect for two travelers on a shared journey",
    icon: <FaUserFriends />, // Friends or couple icon
    people: 2,
  },
  {
    id: 3,
    title: "Family",
    desc: "For families enjoying an adventure together",
    icon: <FaChild />, // Family or child icon
    people: 4,
  },
  {
    id: 4,
    title: "Friends",
    desc: "A group of friends ready for fun",
    icon: <FaUsers />, // Group of users icon
    people: 5,
  },
  {
    id: 5,
    title: "Group",
    desc: "A large group embarking on a shared experience",
    icon: <FaGlobe />, // Group or global icon
    people: 10,
  },
  {
    id: 6,
    title: "Students",
    desc: "Student groups traveling for study or fun",
    icon: <FaSchool />, // School or student-related icon
    people: 15,
  },
  {
    id: 7,
    title: "Corporate Team",
    desc: "Teams traveling for corporate retreats or meetings",
    icon: <FaUsers />, // Users icon to represent team
    people: 20,
  },
  {
    id: 8,
    title: "Adventure Seekers",
    desc: "Thrill-seekers looking for exciting adventures",
    icon: <FaGlobe />, // Adventure-related or global icon
    people: 8,
  },
  {
    id: 9,
    title: "Solo Backpacker",
    desc: "An independent backpacker exploring the world",
    icon: <FaUser />, // Single user or backpacker icon
    people: 1,
  },
  {
    id: 10,
    title: "Tour Group",
    desc: "Large groups organized for sightseeing tours",
    icon: <FaUsers />, // Large group icon
    people: 30,
  },
];

export const SelectBudgetOptions = [
  {
    id: 1,
    title: "Cheap",
    desc: "Stay conscious of cost",
    icon: <FaPiggyBank />, // Piggy bank icon for saving money
  },
  {
    id: 2,
    title: "Affordable",
    desc: "Great value for your money",
    icon: <FaWallet />, // Wallet icon for affordability
  },
  {
    id: 3,
    title: "Moderate",
    desc: "A balance between cost and comfort",
    icon: <FaMoneyBillWave />, // Money bill icon for moderate spending
  },
  {
    id: 4,
    title: "Premium",
    desc: "Luxury and comfort within reach",
    icon: <FaCreditCard />, // Credit card icon for premium options
  },
  {
    id: 5,
    title: "Luxury",
    desc: "Top-tier experiences and comfort",
    icon: <FaGem />, // Gem icon for luxury and exclusivity
  },
  {
    id: 6,
    title: "Backpacker",
    desc: "Minimal cost for adventurous travelers",
    icon: <FaCoins />, // Coin icon for frugal backpacking
  },
  {
    id: 7,
    title: "Eco-Friendly",
    desc: "Budget-friendly and sustainable",
    icon: <FaBalanceScale />, // Scale icon for eco-conscious and fair spending
  },
  {
    id: 8,
    title: "All-Inclusive",
    desc: "Everything included for convenience",
    icon: <FaCrown />, // Crown icon for premium packages
  },
  {
    id: 9,
    title: "Budget Family",
    desc: "Affordable trips for the whole family",
    icon: <FaWallet />, // Wallet icon for affordable family trips
  },
  {
    id: 10,
    title: "Ultra-Luxury",
    desc: "Exclusive, luxurious, and personalized experiences",
    icon: <FaGem />, // Gem icon to emphasize ultra-luxury
  },
];

export const AI_PROMPT = "Generate Travel Plan for Location : {location}";
