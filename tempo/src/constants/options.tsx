import {
  FaUser,
  FaUsers,
  FaChild,
  FaUserFriends,
  FaGlobe,
  FaSchool,
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
